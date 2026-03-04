import { serverConfig } from "./config";
import { generateImage } from "./lib/comfyui";
import {
  HttpError,
  errorResponse,
  handleOptions,
  json,
  readJson,
  textResponse,
} from "./lib/http";
import {
  chat,
  craftImagePrompt,
  listModels,
  type MessagePayload,
  type ProviderPayload,
} from "./lib/ollama";

type ModelsRequest = {
  provider: ProviderPayload;
};

type ChatRequest = {
  provider: ProviderPayload;
  messages: MessagePayload[];
};

type ImageRequest = {
  provider: ProviderPayload;
  prompt: string;
  baseUrl?: string;
  checkpoint?: string;
  negativePrompt?: string;
  aspectRatio?: "1:1" | "16:9" | "4:5";
};

function routeNotFound(pathname: string) {
  return errorResponse(`Unknown route: ${pathname}`, 404);
}

const server = Bun.serve({
  port: serverConfig.port,
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json({
          ok: true,
          ollamaLocalUrl: serverConfig.ollamaLocalUrl,
          comfyUrl: serverConfig.comfyUrl,
        });
      }

      if (request.method === "POST" && url.pathname === "/api/models") {
        const body = await readJson<ModelsRequest>(request);
        const models = await listModels(body.provider);
        return json({ models });
      }

      if (request.method === "POST" && url.pathname === "/api/chat") {
        const body = await readJson<ChatRequest>(request);
        const reply = await chat(body.provider, body.messages);
        return json({ reply });
      }

      if (request.method === "POST" && url.pathname === "/api/images/generate") {
        const body = await readJson<ImageRequest>(request);
        const refinedPrompt = await craftImagePrompt(body.provider, body.prompt);
        const result = await generateImage({
          baseUrl: body.baseUrl,
          checkpoint: body.checkpoint,
          prompt: refinedPrompt,
          negativePrompt: body.negativePrompt,
          aspectRatio: body.aspectRatio,
        });

        return json({
          refinedPrompt,
          ...result,
        });
      }

      if (request.method === "GET" && url.pathname === "/") {
        return textResponse("Chat Comp API is running.");
      }

      return routeNotFound(url.pathname);
    } catch (error) {
      if (error instanceof HttpError) {
        return errorResponse(error.message, error.status);
      }

      const message = error instanceof Error ? error.message : "Unexpected server error.";
      return errorResponse(message, 500);
    }
  },
});

console.log(`Chat Comp API listening on http://127.0.0.1:${server.port}`);
