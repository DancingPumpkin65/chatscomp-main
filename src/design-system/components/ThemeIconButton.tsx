import { Moon, Sun } from "lucide-react";
import type { Theme } from "../theme/ThemeProvider";

export function ThemeIconButton({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[4px_4px_0px_0px_var(--shadow-color)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--foreground)] hover:text-[var(--foreground-inverse)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
