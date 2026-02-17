import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-[var(--foreground)] text-[var(--foreground-inverse)]",
        secondary: "border-[var(--border)] bg-[var(--surface-alt)] text-[var(--foreground)]",
        destructive: "border-[var(--border)] bg-[var(--destructive)] text-[var(--foreground-inverse)]",
        outline: "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]",
        success: "border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-inverse)]",
        warning: "border-[var(--border)] bg-[var(--warning)] text-[var(--foreground-inverse)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
