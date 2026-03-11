import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!(key in Bun.env)) {
      Bun.env[key] = value;
    }
  }
}

loadDotEnvFile();

export const serverConfig = {
  port: Number(Bun.env.PORT ?? 3001),
  ollamaLocalUrl: Bun.env.OLLAMA_LOCAL_URL ?? "http://127.0.0.1:11434",
  ollamaApiUrl: Bun.env.OLLAMA_API_URL ?? "",
  ollamaApiKey: Bun.env.OLLAMA_API_KEY ?? "",
  comfyUrl: Bun.env.COMFYUI_URL ?? "http://127.0.0.1:8188",
  comfyCheckpoint: Bun.env.COMFYUI_DEFAULT_CHECKPOINT ?? "",
  comfyLora: Bun.env.COMFYUI_DEFAULT_LORA ?? "",
  comfyLoraStrengthModel: Number(Bun.env.COMFYUI_DEFAULT_LORA_STRENGTH_MODEL ?? 1),
  comfyLoraStrengthClip: Number(Bun.env.COMFYUI_DEFAULT_LORA_STRENGTH_CLIP ?? 1),
  comfySampler: Bun.env.COMFYUI_DEFAULT_SAMPLER ?? "euler",
  comfyScheduler: Bun.env.COMFYUI_DEFAULT_SCHEDULER ?? "normal",
  comfySteps: Number(Bun.env.COMFYUI_DEFAULT_STEPS ?? 28),
  comfyCfg: Number(Bun.env.COMFYUI_DEFAULT_CFG ?? 7),
  comfySizeSquare: Number(Bun.env.COMFYUI_SIZE_SQUARE ?? 768),
  comfySizeWideWidth: Number(Bun.env.COMFYUI_SIZE_WIDE_WIDTH ?? 1024),
  comfySizeWideHeight: Number(Bun.env.COMFYUI_SIZE_WIDE_HEIGHT ?? 576),
  comfySizePortraitWidth: Number(Bun.env.COMFYUI_SIZE_PORTRAIT_WIDTH ?? 768),
  comfySizePortraitHeight: Number(Bun.env.COMFYUI_SIZE_PORTRAIT_HEIGHT ?? 960),
  comfyPollTimeoutMs: Number(Bun.env.COMFYUI_POLL_TIMEOUT_MS ?? 3600000),
  comfyPollIntervalMs: Number(Bun.env.COMFYUI_POLL_INTERVAL_MS ?? 1500),
  comfyNegativePrompt:
    Bun.env.COMFYUI_NEGATIVE_PROMPT ??
    "blurry, distorted, low quality, deformed, duplicate",
};
