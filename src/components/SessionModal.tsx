import { RefreshCw, X } from "lucide-react";
import { Badge, Button, Card, Input } from "../design-system";
import type { SessionSettings } from "../types";

type SessionModalProps = {
  open: boolean;
  settings: SessionSettings;
  models: string[];
  modelsStatus: "idle" | "loading" | "ready" | "error";
  modelsError: string;
  onClose: () => void;
  onRefreshModels: () => void;
  onSettingsChange: (update: Partial<SessionSettings>) => void;
};

export function SessionModal({
  open,
  settings,
  models,
  modelsStatus,
  modelsError,
  onClose,
  onRefreshModels,
  onSettingsChange,
}: SessionModalProps) {
  if (!open) {
    return null;
  }

  const localMode = settings.providerMode === "local";
  const showLocalSelect = localMode && models.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[color-mix(in_srgb,var(--background-alt)_34%,transparent)] px-4 py-10 backdrop-blur-[2px] md:items-center">
      <Card className="w-full max-w-xl bg-[var(--surface)]">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[var(--border)] p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
              Session Control
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.08em] text-[var(--foreground)]">
              Configure this chat
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Local mode reads installed Ollama models automatically. ComfyUI values stay in `.env`.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition hover:bg-[var(--foreground)] hover:text-[var(--foreground-inverse)]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-5 p-5">
          <div className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
              Provider
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={localMode ? "primary" : "outline"}
                onClick={() => onSettingsChange({ providerMode: "local" })}
              >
                Local Ollama
              </Button>
              <Button
                variant={localMode ? "outline" : "primary"}
                onClick={() => onSettingsChange({ providerMode: "api" })}
              >
                API Method
              </Button>
            </div>
          </div>

          {localMode ? (
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={onRefreshModels}>
                  <RefreshCw className={modelsStatus === "loading" ? "animate-spin" : ""} />
                  Detect models
                </Button>
                <Badge variant={modelsStatus === "error" ? "destructive" : "outline"}>
                  {modelsStatus}
                </Badge>
              </div>

              {showLocalSelect ? (
                <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
                  Installed models
                  <select
                    value={settings.model}
                    onChange={(event) => onSettingsChange({ model: event.target.value })}
                    className="h-10 w-full border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none"
                  >
                    {models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="border-2 border-[var(--border)] bg-[var(--surface-alt)] px-3 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
                  {modelsStatus === "loading"
                    ? "Checking local Ollama for installed models."
                    : "No local models detected yet. Start Ollama and refresh models."}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
                Ollama API URL
                <Input
                  value={settings.baseUrl}
                  placeholder="http://localhost:11434"
                  onChange={(event) => onSettingsChange({ baseUrl: event.target.value })}
                />
              </label>
              <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
                Model name
                <Input
                  value={settings.model}
                  placeholder="gemma4:e2b"
                  onChange={(event) => onSettingsChange({ model: event.target.value })}
                />
              </label>
              <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--foreground-muted)]">
                API key
                <Input
                  value={settings.apiKey}
                  placeholder="Optional bearer token"
                  onChange={(event) => onSettingsChange({ apiKey: event.target.value })}
                />
                <span className="text-xs font-normal normal-case tracking-normal text-[var(--foreground-muted)]">
                  Example model name: `gemma4:e2b`
                </span>
              </label>
            </div>
          )}

          {modelsError ? (
            <p className="text-sm leading-6 text-[var(--destructive)]">{modelsError}</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
