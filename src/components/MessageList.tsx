import { Bot, Image as ImageIcon, User } from "lucide-react";
import type { RefObject } from "react";
import { Badge, Card } from "../design-system";
import type { ChatMessage, WorkspaceMode } from "../types";

type MessageListProps = {
  mode: WorkspaceMode;
  messages: ChatMessage[];
  isSending: boolean;
  endRef: RefObject<HTMLDivElement | null>;
  endOffset: number;
};

function MessageIcon({ role }: { role: ChatMessage["role"] }) {
  if (role === "assistant") {
    return <Bot className="size-4" />;
  }
  if (role === "user") {
    return <User className="size-4" />;
  }
  return <ImageIcon className="size-4" />;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MessageList({ mode, messages, isSending, endRef, endOffset }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-[8px_8px_0_0_var(--shadow-color)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
            Empty Thread
          </p>
          <h3 className="mt-4 text-4xl font-black uppercase tracking-[-0.08em] text-[var(--foreground)]">
            {mode === "chat" ? "Ask your local model anything" : "Spin up a guided image run"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)]">
            Drop an image, type a model name, switch between local and API mode, then send from the composer below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-6 md:px-6">
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";
        return (
          <div
            key={message.id}
            className={`message-fade-in flex ${isAssistant ? "justify-start" : "justify-end"}`}
          >
            <Card
              className={`max-w-3xl p-4 ${
                isAssistant
                  ? "bg-[var(--surface)]"
                  : "bg-[color-mix(in_srgb,var(--accent-light)_42%,var(--surface)_58%)]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                  <MessageIcon role={message.role} />
                  <span>{message.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  {message.images?.length ? <Badge variant="warning">image batch</Badge> : null}
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
                {message.content}
              </div>

              {message.attachments?.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {message.attachments.map((attachment) => (
                    <figure key={attachment.id} className="border-2 border-[var(--border)] bg-[var(--surface-alt)] p-2">
                      <img
                        src={attachment.dataUrl}
                        alt={attachment.name}
                        className="aspect-video w-full object-cover"
                      />
                      <figcaption className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                        {attachment.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}

              {message.images?.length ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {message.images.map((image, index) => (
                    <figure key={`${message.id}-${index}`} className="border-2 border-[var(--border)] bg-[var(--surface-alt)] p-2">
                      <img src={image} alt={`Generated result ${index + 1}`} className="w-full object-cover" />
                    </figure>
                  ))}
                </div>
              ) : null}

              {message.meta?.refinedPrompt || message.meta?.checkpoint || message.meta?.lora ? (
                <div className="mt-4 grid gap-2 text-xs leading-6 text-[var(--foreground-muted)]">
                  {message.meta.refinedPrompt ? (
                    <p>
                      <span className="font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">
                        Refined prompt:
                      </span>{" "}
                      {message.meta.refinedPrompt}
                    </p>
                  ) : null}
                  {message.meta.checkpoint ? (
                    <p>
                      <span className="font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">
                        Checkpoint:
                      </span>{" "}
                      {message.meta.checkpoint}
                    </p>
                  ) : null}
                  {message.meta.lora ? (
                    <p>
                      <span className="font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">
                        LoRA:
                      </span>{" "}
                      {message.meta.lora}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </Card>
          </div>
        );
      })}

      {isSending ? (
        <div className="flex justify-start">
          <Card className="max-w-xl p-4">
            <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              <Bot className="size-4 animate-pulse" />
              Processing {mode === "chat" ? "response" : "generation"}...
            </div>
          </Card>
        </div>
      ) : null}
      <div ref={endRef} style={{ height: 1, scrollMarginBottom: `${endOffset}px` }} />
    </div>
  );
}
