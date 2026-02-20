import { MessageSquarePlus, Trash2 } from "lucide-react";
import { Badge, Button, ThemeIconButton, useTheme } from "../design-system";
import type { ChatSession } from "../types";

type SidebarProps = {
  sessions: ChatSession[];
  activeSessionId: string;
  onCreateSession: () => void;
  onSelect: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function Sidebar({
  sessions,
  activeSessionId,
  onCreateSession,
  onSelect,
  onDeleteSession,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="relative flex min-h-[100dvh] flex-col border-r-2 border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_86%,var(--background)_14%)] lg:fixed lg:inset-y-0 lg:left-0 lg:w-[320px]">
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative sticky top-0 z-10 flex flex-col gap-4 border-b-2 border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-4 backdrop-blur-sm">
        <div className="border-2 border-[var(--border)] bg-[var(--surface)] p-4 shadow-[6px_6px_0_0_var(--shadow-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
                Local Workspace
              </p>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-[-0.08em] text-[var(--foreground)]">
                ChatsComp.
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeIconButton theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>

        <div>
          <Button variant="primary" className="w-full justify-start" onClick={onCreateSession}>
            <MessageSquarePlus />
            New chat
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
            History
          </p>
          <Badge variant="secondary">{sessions.length}</Badge>
        </div>

        <div className="chat-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(session.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(session.id);
                  }
                }}
                className={`border-2 p-3 text-left transition ${
                  isActive
                    ? "border-[var(--border)] bg-[var(--foreground)] text-[var(--foreground-inverse)] shadow-[4px_4px_0_0_var(--shadow-color)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--shadow-color)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em]">
                      {session.title}
                    </p>
                    <p
                      className={`mt-2 line-clamp-2 text-xs leading-5 ${
                        isActive
                          ? "text-[color-mix(in_srgb,var(--foreground-inverse)_72%,transparent)]"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      {session.messages.at(-1)?.content || "Start the thread from the composer."}
                    </p>
                  </div>
                  <Badge variant={session.mode === "image" ? "warning" : "secondary"}>
                    {session.mode}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.22em] ${
                      isActive
                        ? "text-[color-mix(in_srgb,var(--foreground-inverse)_72%,transparent)]"
                        : "text-[var(--foreground-muted)]"
                    }`}
                  >
                    {formatTimestamp(session.updatedAt)}
                  </p>
                  <button
                    type="button"
                    aria-label={`Delete ${session.title}`}
                    title="Delete chat"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className={`flex h-7 w-7 items-center justify-center border transition ${
                      isActive
                        ? "border-[color-mix(in_srgb,var(--foreground-inverse)_45%,transparent)] text-[var(--foreground-inverse)] hover:bg-[color-mix(in_srgb,var(--foreground-inverse)_12%,transparent)]"
                        : "border-[var(--border-subtle)] text-[var(--foreground-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-alt)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
