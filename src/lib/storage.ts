import type { ChatSession } from "../types";
const STORAGE_KEY = "chat-comp.sessions.v1";
export function loadSessions() { if (typeof window === "undefined") return [] as ChatSession[]; try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? (JSON.parse(raw) as ChatSession[]) : []; } catch { return [] as ChatSession[]; } }
export function saveSessions(sessions: ChatSession[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }
