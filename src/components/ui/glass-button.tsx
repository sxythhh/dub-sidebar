"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

/* ── Primary (e.g. "Continue") ── */

interface GlassPrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function GlassPrimaryButton({
  className,
  disabled,
  ...props
}: GlassPrimaryButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full h-9 min-w-[140px] px-6 text-sm font-medium tracking-[-0.09px] transition-all active:scale-[0.98] dark:invert",
        disabled && "opacity-30 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      style={{ backgroundColor: "oklch(0 0 0)", color: "oklch(1 0 0)" }}
      type="button"
      {...props}
    />
  );
}

/* ── Secondary (e.g. "Save as draft") ── */

interface GlassSecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function GlassSecondaryButton({
  className,
  ...props
}: GlassSecondaryButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full h-9 px-4 text-sm font-medium tracking-[-0.09px] text-glass-text-secondary border border-glass-border transition-colors hover:bg-border-strong active:scale-[0.98]",
        className,
      )}
      style={{
        backgroundColor: "var(--glass-surface)",
        backgroundImage:
          "radial-gradient(33.86% 79.61% at 50.57% 0%, var(--glass-subtle) 0%, oklch(1 0 0 / 0.006) 100%)",
      }}
      type="button"
      {...props}
    />
  );
}

/* ── Icon button (e.g. trash/delete) ── */

interface GlassIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: number;
}

function GlassIconButton({
  className,
  size = 40,
  style,
  ...props
}: GlassIconButtonProps) {
  return (
    <button
      className={cn(
        "border-[0.83px] border-glass-border flex shrink-0 items-center justify-center rounded-full glass-hover",
        className,
      )}
      style={{
        backgroundColor: "var(--glass-surface)",
        backgroundImage:
          "radial-gradient(33.86% 79.61% at 50.57% 0%, var(--glass-subtle) 0%, oklch(1 0 0 / 0.006) 100%)",
        height: size,
        width: size,
        ...style,
      }}
      type="button"
      {...props}
    />
  );
}

/* ── Add button (icon + text row) ── */

interface GlassAddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function GlassAddButton({
  className,
  icon,
  children,
  ...props
}: GlassAddButtonProps) {
  return (
    <button
      className={cn(
        "bg-hover flex flex-1 items-center justify-center gap-2 rounded-full py-2 px-4 glass-hover",
        className,
      )}
      type="button"
      {...props}
    >
      {icon}
      <span className="text-sm font-medium leading-[120%] tracking-[-0.09px] text-glass-text-secondary">
        {children}
      </span>
    </button>
  );
}

/* ── Action button pair (e.g. Reject / Accept) ── */

interface GlassActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function GlassActionButton({
  className,
  icon,
  children,
  ...props
}: GlassActionButtonProps) {
  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-1.5 rounded-full h-9 pl-2.5 pr-3",
        "border border-[oklch(0_0_0/0.15)] dark:border-[oklch(1_0_0/0.15)]",
        "text-sm font-medium leading-[120%] tracking-[-0.09px]",
        "glass-hover",
        className,
      )}
      style={{
        backgroundColor: "var(--glass-action-btn-bg, var(--background))",
        color: "var(--ap-text, inherit)",
      }}
      type="button"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export {
  GlassPrimaryButton,
  GlassSecondaryButton,
  GlassIconButton,
  GlassAddButton,
  GlassActionButton,
};
