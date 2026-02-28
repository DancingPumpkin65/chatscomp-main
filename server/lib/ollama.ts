import { serverConfig } from "../config";
import { HttpError, fetchJson } from "./http";

export type ProviderMode = "local" | "api";

export type ProviderPayload = {
  mode: ProviderMode;
  baseUrl?: string;
  apiKey?: string;
  model: string;
};

export type AttachmentPayload = {
  name: string;
  mimeType: string;
  dataUrl: string;
};

export type MessagePayload = {
  role: "system" | "user" | "assistant";
  content: string;
  attachments?: AttachmentPayload[];
};

type OllamaTagsResponse = {
  models?: Array<{
    name: string;
    model?: string;
  }>;
};

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
};

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export function resolveProvider(provider: ProviderPayload) {
  const isLocal = provider.mode === "local";
  const baseUrl = trimSlash(
    isLocal
      ? serverConfig.ollamaLocalUrl
      : provider.baseUrl?.trim() || serverConfig.ollamaApiUrl,
  );

  if (!baseUrl) {
    throw new HttpError("Add an Ollama API base URL before using API mode.", 400);
  }

  return {
    mode: provider.mode,
    model: provider.model.trim(),
    baseUrl,
    apiKey: isLocal ? "" : provider.apiKey?.trim() || serverConfig.ollamaApiKey,
  };
}

function buildHeaders(apiKey?: string) {
  return {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };
}

function stripDataUrl(dataUrl: string) {
  const [, encoded] = dataUrl.split(",", 2);
  return encoded ?? dataUrl;
}

export async function listModels(provider: ProviderPayload) {
  const config = resolveProvider(provider);
  const data = await fetchJson<OllamaTagsResponse>(`${config.baseUrl}/api/tags`, {
    headers: buildHeaders(config.apiKey),
  });

  return (data.models ?? [])
    .map((entry) => entry.name || entry.model || "")
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

export async function chat(provider: ProviderPayload, messages: MessagePayload[]) {
  const config = resolveProvider(provider);
  if (!config.model) {
    throw new HttpError("Enter a model name before sending a chat request.", 400);
  }

  const body = {
    model: config.model,
    stream: false,
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
      images: message.attachments?.map((attachment) => stripDataUrl(attachment.dataUrl)),
    })),
  };

  const data = await fetchJson<OllamaChatResponse>(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: buildHeaders(config.apiKey),
    body: JSON.stringify(body),
  });

  return data.message?.content?.trim() || "No response returned by the selected model.";
}

export async function craftImagePrompt(provider: ProviderPayload, prompt: string) {
  const promptText = prompt.trim();
  if (!promptText) {
    throw new HttpError("Write a prompt before generating an image.", 400);
  }

  const assistantPrompt = await chat(provider, [
    {
      role: "system",
      content:
        "You rewrite image ideas into one vivid prompt for a text-to-image model. Return only the final prompt in plain text with no list, no labels, and no quotes.",
    },
    {
      role: "user",
      content: promptText,
    },
  ]);

  return assistantPrompt || promptText;
}
