import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-[2px] active:translate-x-[2px]",
  {
    variants: {
      variant: {
        default:
          "border-2 border-[var(--border)] bg-[var(--foreground)] text-[var(--foreground-inverse)] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[var(--accent)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        primary:
          "border-2 border-[var(--border)] bg-[var(--accent)] text-[var(--foreground-inverse)] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[var(--accent-hover)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        destructive:
          "border-2 border-[var(--border)] bg-[var(--destructive)] text-[var(--foreground-inverse)] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[color-mix(in_srgb,var(--destructive)_86%,black)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        outline:
          "border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[var(--foreground)] hover:text-[var(--foreground-inverse)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        secondary:
          "border-2 border-[var(--border)] bg-[var(--surface-alt)] text-[var(--foreground)] shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[var(--surface-muted)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        ghost:
          "border-2 border-transparent bg-transparent text-[var(--foreground)] hover:border-[var(--border)] hover:bg-[var(--surface-alt)] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_0px_var(--shadow-color)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
