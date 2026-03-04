import type { AspectRatio, Attachment, ChatMessage, ProviderMode, SessionSettings } from "../types";
type ProviderPayload = { mode: ProviderMode; baseUrl?: string; apiKey?: string; model: string };
function providerFromSettings(settings: SessionSettings): ProviderPayload { return { mode: settings.providerMode, baseUrl: settings.baseUrl, apiKey: settings.apiKey, model: settings.model }; }
async function postJson<T>(path: string, body: unknown) { const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = (await response.json()) as T & { error?: string }; if (!response.ok) throw new Error(data.error || "Request failed."); return data; }

export async function fetchModels(settings: SessionSettings) { const data = await postJson<{ models: string[] }>("/api/models", { provider: providerFromSettings(settings) }); return data.models; }

export async function sendChatRequest(settings: SessionSettings, messages: ChatMessage[]) { const data = await postJson<{ reply: string }>("/api/chat", { provider: providerFromSettings(settings), messages: messages.map((message) => ({ role: message.role, content: message.content, attachments: message.attachments })) }); return data.reply; }

export async function generateImageRequest(settings: SessionSettings, prompt: string, aspectRatio: AspectRatio, attachments: Attachment[]) { const promptWithReference = attachments.length > 0 ? `${prompt}\n\nReference notes: attached ${attachments.length} image(s) for visual context.` : prompt; return postJson<{ images: string[]; refinedPrompt: string; checkpoint: string; lora?: string }>("/api/images/generate", { provider: providerFromSettings(settings), prompt: promptWithReference, aspectRatio }); }
