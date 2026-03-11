import type { Attachment, ChatMessage, ChatSession, SessionSettings, WorkspaceMode } from "../types";

export const defaultSettings: SessionSettings = {
  providerMode: "local",
  model: "llama3.2",
  baseUrl: "",
  apiKey: "",
  aspectRatio: "1:1",
};

export function createMessage(
  role: ChatMessage["role"],
  content: string,
  attachments: Attachment[] = [],
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };
}

export function createSession(mode: WorkspaceMode = "chat"): ChatSession {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: mode === "image" ? "New image run" : "New chat",
    createdAt: now,
    updatedAt: now,
    mode,
    messages: [],
    settings: { ...defaultSettings },
  };
}

export function deriveTitle(content: string) {
  const normalized = content.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return "New chat";
  }
  return normalized.slice(0, 42);
}

export function touchSession(session: ChatSession, update: Partial<ChatSession>): ChatSession {
  return {
    ...session,
    ...update,
    updatedAt: new Date().toISOString(),
  };
}
