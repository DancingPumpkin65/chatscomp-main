import { serverConfig } from "../config";
import { HttpError, fetchJson } from "./http";

export type ComfyPayload = {
  baseUrl?: string;
  checkpoint?: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "1:1" | "16:9" | "4:5";
};

type WorkflowOptions = {
  checkpoint: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio?: ComfyPayload["aspectRatio"];
  loraName?: string;
  loraStrengthModel: number;
  loraStrengthClip: number;
  steps: number;
  cfg: number;
  samplerName: string;
  scheduler: string;
};

type ComfyPromptResponse = {
  prompt_id?: string;
};

type ComfyHistoryEntry = {
  outputs?: Record<
    string,
    {
      images?: Array<{
        filename: string;
        subfolder: string;
        type: string;
      }>;
    }
  >;
};

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

function getCanvasSize(aspectRatio: ComfyPayload["aspectRatio"]) {
  switch (aspectRatio) {
    case "16:9":
      return {
        width: serverConfig.comfySizeWideWidth,
        height: serverConfig.comfySizeWideHeight,
      };
    case "4:5":
      return {
        width: serverConfig.comfySizePortraitWidth,
        height: serverConfig.comfySizePortraitHeight,
      };
    case "1:1":
    default:
      return {
        width: serverConfig.comfySizeSquare,
        height: serverConfig.comfySizeSquare,
      };
  }
}

function buildWorkflow(options: WorkflowOptions) {
  const { width, height } = getCanvasSize(options.aspectRatio);
  const modelNode = options.loraName ? ["10", 0] : ["4", 0];
  const clipNode = options.loraName ? ["10", 1] : ["4", 1];

  return {
    "3": {
      inputs: {
        seed: Math.floor(Math.random() * 999999999999),
        steps: options.steps,
        cfg: options.cfg,
        sampler_name: options.samplerName,
        scheduler: options.scheduler,
        denoise: 1,
        model: modelNode,
        positive: ["6", 0],
        negative: ["7", 0],
        latent_image: ["5", 0],
      },
      class_type: "KSampler",
    },
    "4": {
      inputs: {
        ckpt_name: options.checkpoint,
      },
      class_type: "CheckpointLoaderSimple",
    },
    "5": {
      inputs: {
        width,
        height,
        batch_size: 1,
      },
      class_type: "EmptyLatentImage",
    },
    "6": {
      inputs: {
        text: options.prompt,
        clip: clipNode,
      },
      class_type: "CLIPTextEncode",
    },
    "7": {
      inputs: {
        text: options.negativePrompt,
        clip: clipNode,
      },
      class_type: "CLIPTextEncode",
    },
    "8": {
      inputs: {
        samples: ["3", 0],
        vae: ["4", 2],
      },
      class_type: "VAEDecode",
    },
    "9": {
      inputs: {
        filename_prefix: "chat-comp",
        images: ["8", 0],
      },
      class_type: "SaveImage",
    },
    ...(options.loraName
      ? {
          "10": {
            inputs: {
              lora_name: options.loraName,
              strength_model: options.loraStrengthModel,
              strength_clip: options.loraStrengthClip,
              model: ["4", 0],
              clip: ["4", 1],
            },
            class_type: "LoraLoader",
          },
        }
      : {}),
  };
}

async function pollForImages(baseUrl: string, promptId: string) {
  const startedAt = Date.now();
  const timeoutMs = serverConfig.comfyPollTimeoutMs;
  const pollIntervalMs = serverConfig.comfyPollIntervalMs;

  while (Date.now() - startedAt < timeoutMs) {
    const data = await fetchJson<Record<string, ComfyHistoryEntry>>(
      `${baseUrl}/history/${promptId}`,
    );
    const history = data[promptId];
    const images =
      history?.outputs &&
      Object.values(history.outputs)
        .flatMap((output) => output.images ?? [])
        .filter(Boolean);

    if (images && images.length > 0) {
      return images;
    }

    await Bun.sleep(pollIntervalMs);
  }

  throw new HttpError(
    `ComfyUI timed out after ${Math.round(timeoutMs / 60000)} minute(s) before returning an image.`,
    504,
  );
}

export async function generateImage(payload: ComfyPayload) {
  const baseUrl = trimSlash(payload.baseUrl?.trim() || serverConfig.comfyUrl);
  const checkpoint = payload.checkpoint?.trim() || serverConfig.comfyCheckpoint;
  const loraName = serverConfig.comfyLora.trim();
  const negativePrompt = payload.negativePrompt?.trim() || serverConfig.comfyNegativePrompt;

  if (!checkpoint) {
    throw new HttpError(
      "Set COMFYUI_DEFAULT_CHECKPOINT or enter a checkpoint name in the app before generating images.",
      400,
    );
  }

  const prompt = payload.prompt.trim();
  if (!prompt) {
    throw new HttpError("Write a prompt before generating an image.", 400);
  }

  try {
    const workflow = buildWorkflow({
      checkpoint,
      prompt,
      negativePrompt,
      aspectRatio: payload.aspectRatio,
      loraName,
      loraStrengthModel: serverConfig.comfyLoraStrengthModel,
      loraStrengthClip: serverConfig.comfyLoraStrengthClip,
      steps: serverConfig.comfySteps,
      cfg: serverConfig.comfyCfg,
      samplerName: serverConfig.comfySampler,
      scheduler: serverConfig.comfyScheduler,
    });
    const queue = await fetchJson<ComfyPromptResponse>(`${baseUrl}/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: crypto.randomUUID(),
        prompt: workflow,
      }),
    });

    if (!queue.prompt_id) {
      throw new HttpError("ComfyUI did not return a prompt id.", 502);
    }

    const images = await pollForImages(baseUrl, queue.prompt_id);
    const results = await Promise.all(
      images.map(async (image) => {
        const query = new URLSearchParams({
          filename: image.filename,
          subfolder: image.subfolder ?? "",
          type: image.type ?? "output",
        });

        const response = await fetch(`${baseUrl}/view?${query.toString()}`);
        if (!response.ok) {
          throw new HttpError("ComfyUI generated an image but it could not be downloaded.", 502);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `data:image/png;base64,${base64}`;
      }),
    );

    return {
      images: results,
      checkpoint,
      lora: loraName || undefined,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.message.includes("memory layout cannot be allocated")) {
        throw new HttpError(
          "ComfyUI ran out of memory. Reduce image size, use a lighter checkpoint, or disable the LoRA.",
          error.status,
        );
      }

      throw error;
    }

    throw new HttpError(
      `ComfyUI is not reachable at ${baseUrl}. Start ComfyUI or update COMFYUI_URL in .env.`,
      502,
    );
  }
}
