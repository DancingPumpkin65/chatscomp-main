import type { ChatSession } from "../types";

const STORAGE_KEY = "chat-comp.sessions.v1";

function sanitizeSessionsForStorage(sessions: ChatSession[]) {
  return sessions.map((session) => ({
    ...session,
    messages: session.messages.map((message) => ({
      ...message,
      images: undefined,
      attachments: undefined,
    })),
  }));
}

export function loadSessions() {
  if (typeof window === "undefined") {
    return [] as ChatSession[];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [] as ChatSession[];
    }

    const parsed = JSON.parse(raw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as ChatSession[];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeSessionsForStorage(sessions)));
  } catch (error) {
    console.warn("Failed to persist chat history.", error);
  }
}
