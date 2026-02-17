export type ProviderMode = "local" | "api";
export type WorkspaceMode = "chat" | "image";
export type AspectRatio = "1:1" | "16:9" | "4:5";
export type Attachment = { id: string; name: string; mimeType: string; dataUrl: string };
export type ChatMessage = { id: string; role: "user" | "assistant" | "system"; content: string; createdAt: string; attachments?: Attachment[]; images?: string[]; meta?: { refinedPrompt?: string; checkpoint?: string; lora?: string } };
export type SessionSettings = { providerMode: ProviderMode; model: string; baseUrl: string; apiKey: string; aspectRatio: AspectRatio };
export type ChatSession = { id: string; title: string; createdAt: string; updatedAt: string; mode: WorkspaceMode; messages: ChatMessage[]; settings: SessionSettings };
