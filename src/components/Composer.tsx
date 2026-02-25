import { ImagePlus, Paperclip, Plus, Send, Settings2, WandSparkles, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { Button } from "../design-system";
import type { Attachment, WorkspaceMode } from "../types";

type ComposerProps = {
  mode: WorkspaceMode;
  prompt: string;
  attachments: Attachment[];
  isSending: boolean;
  dragActive: boolean;
  onPromptChange: (value: string) => void;
  onModeChange: (mode: WorkspaceMode) => void;
  onOpenSession: () => void;
  onAttachClick: () => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onSubmit: () => void;
};

export function Composer({
  mode,
  prompt,
  attachments,
  isSending,
  dragActive,
  onPromptChange,
  onModeChange,
  onOpenSession,
  onAttachClick,
  onRemoveAttachment,
  onSubmit,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 208)}px`;
  }, [prompt]);

  return (
    <div className="border-t-2 border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 backdrop-blur-sm md:p-6">
      <div className="mx-auto max-w-5xl">
        {attachments.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group relative overflow-hidden border-2 border-[var(--border)] bg-[var(--surface)]"
              >
                <img src={attachment.dataUrl} alt={attachment.name} className="h-20 w-28 object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="absolute right-1 top-1 border-2 border-[var(--border)] bg-[var(--surface)] p-1 opacity-0 transition group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
                <p className="max-w-28 truncate border-t-2 border-[var(--border)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--foreground-muted)]">
                  {attachment.name}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={`border-2 border-[var(--border)] bg-[var(--surface)] shadow-[8px_8px_0_0_var(--shadow-color)] transition ${
            dragActive ? "translate-x-[2px] translate-y-[2px] shadow-[4px_4px_0_0_var(--accent)]" : ""
          }`}
        >
          <div className="flex items-center gap-2 border-b-2 border-[var(--border)] px-3 py-3">
            <Button size="icon" variant="secondary" onClick={onAttachClick} title="Upload image">
              <Plus />
            </Button>
            <Button
              size="sm"
              variant={mode === "chat" ? "primary" : "outline"}
              onClick={() => onModeChange("chat")}
            >
              <Paperclip />
              Chat
            </Button>
            <Button
              size="sm"
              variant={mode === "image" ? "primary" : "outline"}
              onClick={() => onModeChange("image")}
            >
              <WandSparkles />
              Generate image
            </Button>
            <Button size="sm" variant="outline" onClick={onOpenSession}>
              <Settings2 />
              Session
            </Button>
            <div className="ml-auto hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)] md:flex">
              <ImagePlus className="size-3.5" />
              Drop image anywhere in this panel
            </div>
          </div>

          <div className="grid gap-4 p-3">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              rows={1}
              placeholder={
                mode === "chat"
                  ? "Ask, reason, inspect images..."
                  : "Describe the image you want..."
              }
              className="max-h-[208px] min-h-[28px] w-full resize-none overflow-y-auto bg-transparent py-0 text-sm leading-7 text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)]"
            />

            <div className="flex flex-col gap-3 border-t-2 border-[var(--border)] pt-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                {mode === "chat"
                  ? "Attachments are sent to vision-capable Ollama models as inline images."
                  : "Image mode uses Ollama to enrich your prompt, then hands generation to ComfyUI."}
              </p>
              <Button variant="primary" onClick={onSubmit} disabled={isSending || !prompt.trim()}>
                <Send />
                {isSending ? "Working..." : mode === "chat" ? "Send prompt" : "Generate"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
