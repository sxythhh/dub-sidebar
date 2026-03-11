"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "xs" | "sm" | "md" | "lg";

// ── Variant styles ───────────────────────────────────────────────────

const variantStyles: Record<Variant, string> = {
  primary:
    "rich-button font-medium hover:brightness-[1.08] active:brightness-95",
  secondary:
    "bg-foreground/[0.06] text-page-text font-medium hover:bg-foreground/[0.10] active:bg-foreground/[0.14]",
  outline:
    "border border-border bg-card-bg text-page-text font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-foreground/[0.04] active:bg-foreground/[0.06]",
  ghost:
    "text-page-text font-medium hover:bg-foreground/[0.06] active:bg-foreground/[0.10]",
  destructive:
    "rich-button-destructive font-medium hover:brightness-[1.08] active:brightness-95",
};

// ── Size styles ──────────────────────────────────────────────────────

const sizeStyles: Record<Size, string> = {
  xs: "h-7 gap-1 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
  sm: "h-8 gap-1.5 rounded-[10px] px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
  md: "h-9 gap-2 rounded-xl px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
  lg: "h-10 gap-2 rounded-xl px-5 text-sm [&_svg:not([class*='size-'])]:size-[18px]",
};

const iconSizeStyles: Record<Size, string> = {
  xs: "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
  sm: "size-8 rounded-[10px] [&_svg:not([class*='size-'])]:size-4",
  md: "size-9 rounded-xl [&_svg:not([class*='size-'])]:size-4",
  lg: "size-10 rounded-xl [&_svg:not([class*='size-'])]:size-[18px]",
};

// ── Press spring ─────────────────────────────────────────────────────

const PRESS_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

// ── Spinner ──────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Button ───────────────────────────────────────────────────────────

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Render as square icon button */
  iconOnly?: boolean;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Icon before children */
  leadingIcon?: React.ReactNode;
  /** Icon after children */
  trailingIcon?: React.ReactNode;
  /** Render as child element (Radix Slot pattern) — disables motion press */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      iconOnly = false,
      loading = false,
      leadingIcon,
      trailingIcon,
      asChild = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap outline-none select-none",
      "transition-[background,filter,box-shadow,color] duration-150",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0",
      variantStyles[variant],
      iconOnly ? iconSizeStyles[size] : sizeStyles[size],
      className,
    );

    const content = loading ? (
      <Spinner />
    ) : (
      <>
        {leadingIcon}
        {children}
        {trailingIcon}
      </>
    );

    // asChild renders as Slot — no motion wrapper
    if (asChild) {
      return (
        <Slot ref={ref} className={classes}>
          {content}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={PRESS_SPRING}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

// CVA-compatible helper for class-only usage (e.g. toast action buttons)
function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size | "xs";
  className?: string;
} = {}) {
  const resolvedSize = size === "xs" ? "xs" : (size as Size);
  return cn(
    "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none select-none",
    "transition-[background,filter,box-shadow,color] duration-150",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    variantStyles[variant],
    sizeStyles[resolvedSize],
    className,
  );
}

export { Button, Spinner, buttonVariants };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
