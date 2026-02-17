import type { AspectRatio, Attachment, ChatMessage, ProviderMode, SessionSettings } from "../types";
type ProviderPayload = { mode: ProviderMode; baseUrl?: string; apiKey?: string; model: string };
function providerFromSettings(settings: SessionSettings): ProviderPayload { return { mode: settings.providerMode, baseUrl: settings.baseUrl, apiKey: settings.apiKey, model: settings.model }; }
async function postJson<T>(path: string, body: unknown) { const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = (await response.json()) as T & { error?: string }; if (!response.ok) throw new Error(data.error || "Request failed."); return data; }
