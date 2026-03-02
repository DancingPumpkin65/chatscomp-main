import { startTransition, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Composer } from "./components/Composer";
import { MessageList } from "./components/MessageList";
import { SessionModal } from "./components/SessionModal";
import { Sidebar } from "./components/Sidebar";
import { fetchModels, sendChatRequest } from "./lib/api";
import { createMessage, createSession, deriveTitle, touchSession } from "./lib/session";
import { loadSessions, saveSessions } from "./lib/storage";
import type { Attachment, ChatMessage, ChatSession, SessionSettings, WorkspaceMode } from "./types";

function sortSessions(sessions: ChatSession[]) { return [...sessions].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()); }
export function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => { const stored = loadSessions(); return stored.length > 0 ? sortSessions(stored) : [createSession("chat")]; });
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id ?? "");
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [modelsStatus, setModelsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [modelsError, setModelsError] = useState("");
  const [appError, setAppError] = useState("");
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(() => sessions[0]?.messages.length === 0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  const composerShellRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [composerHeight, setComposerHeight] = useState(0);
  const composerOffset = 220;
  const activeSession = useMemo(() => sessions.find((session) => session.id === activeSessionId) ?? sessions[0], [activeSessionId, sessions]);
  useEffect(() => { if (!activeSession && sessions[0]) setActiveSessionId(sessions[0].id); }, [activeSession, sessions]);
  useEffect(() => { saveSessions(sessions); }, [sessions]);
  useLayoutEffect(() => { const scroller = mainRef.current; const target = endRef.current; if (!scroller || !target) return; const behavior = activeSession.messages.length > 1 ? "smooth" : "auto"; requestAnimationFrame(() => { target.scrollIntoView({ block: "end", behavior }); }); }, [activeSession.id, activeSession.messages.length, isSending, composerOffset]);
  useEffect(() => { if (!activeSession) return; const timeout = window.setTimeout(() => { void refreshModels(activeSession); }, 400); return () => window.clearTimeout(timeout); }, [activeSession?.id, activeSession?.settings.providerMode, activeSession?.settings.baseUrl, activeSession?.settings.apiKey]);
  async function refreshModels(session: ChatSession) { try { setModelsStatus("loading"); setModelsError(""); const nextModels = await fetchModels(session.settings); setModels(nextModels); setModelsStatus("ready"); if (session.settings.providerMode === "local" && nextModels.length > 0 && !nextModels.includes(session.settings.model)) updateSession(session.id, (currentSession) => touchSession(currentSession, { settings: { ...currentSession.settings, model: nextModels[0] } })); } catch (error) { setModelsStatus("error"); setModelsError(error instanceof Error ? error.message : "Could not load models."); } }
  function updateSession(sessionId: string, updater: (session: ChatSession) => ChatSession) { setSessions((currentSessions) => sortSessions(currentSessions.map((session) => session.id === sessionId ? updater(session) : session))); }
  function handleCreateSession() { const session = createSession("chat"); startTransition(() => { setSessions((currentSessions) => sortSessions([session, ...currentSessions])); setActiveSessionId(session.id); setPrompt(""); setAttachments([]); setAppError(""); setIsSessionModalOpen(true); }); }
  function handleSelectSession(sessionId: string) { const nextSession = sessions.find((session) => session.id === sessionId); startTransition(() => { setActiveSessionId(sessionId); setPrompt(""); setAttachments([]); setAppError(""); setIsSessionModalOpen(Boolean(nextSession && nextSession.messages.length === 0)); }); }
  function handleDeleteSession(sessionId: string) { const remainingSessions = sessions.filter((session) => session.id !== sessionId); const nextActiveSession = remainingSessions.find((session) => session.id === activeSessionId) ?? remainingSessions[0]; if (remainingSessions.length === 0) { const replacementSession = createSession("chat"); setSessions([replacementSession]); setActiveSessionId(replacementSession.id); setPrompt(""); setAttachments([]); setAppError(""); setIsSessionModalOpen(true); return; } setSessions(sortSessions(remainingSessions)); setPrompt(""); setAttachments([]); setAppError(""); if (activeSessionId === sessionId && nextActiveSession) { setActiveSessionId(nextActiveSession.id); setIsSessionModalOpen(nextActiveSession.messages.length === 0); } }
  function handleSettingsChange(update: Partial<SessionSettings>) { if (!activeSession) return; updateSession(activeSession.id, (session) => touchSession(session, { settings: { ...session.settings, ...update } })); }
  function handleModeChange(mode: WorkspaceMode) { if (!activeSession) return; updateSession(activeSession.id, (session) => touchSession(session, { mode })); }
  async function handleSend() { if (!activeSession || !prompt.trim() || isSending) return; setIsSending(true); setAppError(""); const session = activeSession.settings.providerMode === "local" && models.length > 0 && !models.includes(activeSession.settings.model) ? { ...activeSession, settings: { ...activeSession.settings, model: models[0] } } : activeSession; const draftPrompt = prompt.trim(); const draftAttachments = attachments; const userMessage = createMessage("user", draftPrompt, draftAttachments); if (session.settings.model !== activeSession.settings.model) updateSession(activeSession.id, (currentSession) => touchSession(currentSession, { settings: { ...currentSession.settings, model: session.settings.model } })); updateSession(session.id, (currentSession) => touchSession(currentSession, { title: currentSession.messages.length === 0 ? deriveTitle(draftPrompt) : currentSession.title, messages: [...currentSession.messages, userMessage] })); setPrompt(""); setAttachments([]); try { const assistantText = await sendChatRequest(session.settings, [...session.messages, userMessage]); const assistantMessage = createMessage("assistant", assistantText); updateSession(session.id, (currentSession) => touchSession(currentSession, { messages: [...currentSession.messages, assistantMessage] })); } catch (error) { const errorMessage = error instanceof Error ? error.message : "The request failed."; setAppError(errorMessage);  } finally { setIsSending(false); } }
  if (!activeSession) return null;
  return (
    <div className="min-h-[100dvh] bg-[var(--background)]">
      <Sidebar sessions={sessions} activeSessionId={activeSession.id} onCreateSession={handleCreateSession} onSelect={handleSelectSession} onDeleteSession={handleDeleteSession} />
      <div className="flex min-h-[100dvh] flex-col lg:ml-[320px]">
        {appError ? <div className="border-b-2 border-[var(--border)] bg-[color-mix(in_srgb,var(--destructive)_16%,var(--surface)_84%)] px-4 py-3 text-sm text-[var(--foreground)]">{appError}</div> : null}
        <main ref={mainRef} className="chat-scrollbar min-h-[100dvh] flex-1 overflow-y-auto" style={{ paddingBottom: `${composerOffset}px` }}><MessageList mode={activeSession.mode} messages={activeSession.messages} isSending={isSending} endRef={endRef} endOffset={composerOffset} /></main>
        <div ref={composerShellRef} className="fixed inset-x-0 bottom-0 z-30 lg:left-[320px]"><Composer mode={activeSession.mode} prompt={prompt} attachments={attachments} isSending={isSending} dragActive={dragActive} onPromptChange={setPrompt} onModeChange={handleModeChange} onOpenSession={() => setIsSessionModalOpen(true)} onAttachClick={() => fileInputRef.current?.click()} onRemoveAttachment={(attachmentId) => setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId))} onSubmit={() => void handleSend()} /></div>
      </div>
      <SessionModal open={isSessionModalOpen} settings={activeSession.settings} models={models} modelsStatus={modelsStatus} modelsError={modelsError} onClose={() => setIsSessionModalOpen(false)} onRefreshModels={() => void refreshModels(activeSession)} onSettingsChange={handleSettingsChange} />
    </div>
  );
}
