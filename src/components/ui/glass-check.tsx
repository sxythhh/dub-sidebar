"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassCheckItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

function GlassCheckItem({
  checked,
  onCheckedChange,
  label,
  description,
  className,
}: GlassCheckItemProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      style={{ backgroundColor: "var(--glass-tint)" }}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl py-3 pl-3 pr-4 text-left transition-colors",
        className,
      )}
    >
      {/* Indicator */}
      <div
        style={
          checked
            ? { backgroundColor: "var(--foreground)", backgroundImage: "radial-gradient(50% 100% at 50% 0%, oklch(1 0 0 / 0.08) 0%, transparent 100%)" }
            : { backgroundColor: "var(--radio-unselected-bg)", backgroundImage: "radial-gradient(50% 100% at 50% 0%, oklch(1 0 0 / 0.08) 0%, transparent 100%)" }
        }
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full backdrop-blur-[4px] border",
          checked
            ? "border-[oklch(1_0_0/0.16)] dark:border-[oklch(0_0_0/0.16)]"
            : "border-[oklch(0_0_0/0.16)] dark:border-[oklch(1_0_0/0.16)]",
        )}
      >
        {checked && (
          <Check size={12} strokeWidth={3} className="text-background" />
        )}
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "text-sm font-medium leading-[120%] tracking-[-0.09px]",
            checked ? "text-foreground" : "text-glass-text-secondary",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs leading-[145%] text-glass-text-secondary">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}

interface GlassCheckGroupProps {
  children: React.ReactNode;
  className?: string;
}

function GlassCheckGroup({ children, className }: GlassCheckGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} role="group">
      {children}
    </div>
  );
}

export { GlassCheckItem, GlassCheckGroup };
