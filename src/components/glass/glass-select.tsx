"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Inline style for trigger button — required because Tailwind v4 preflight
 * sets background-color: transparent on buttons, overriding CSS classes.
 */
const TRIGGER_BG: React.CSSProperties = {
  backgroundColor: "var(--glass-surface)",
  backgroundImage:
    "radial-gradient(33.86% 79.61% at 50.57% 0%, var(--glass-subtle) 0%, oklch(1 0 0 / 0.006) 100%)",
};

interface GlassSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

function GlassSelect({
  value,
  onValueChange,
  placeholder = "Select\u2026",
  options,
  className,
}: GlassSelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(val) => {
        if (val !== null) onValueChange(val as string);
      }}
    >
      <SelectPrimitive.Trigger
        style={TRIGGER_BG}
        className={cn(
          "flex h-10 w-full items-center rounded-xl px-3",
          "border border-glass-border",
          "text-sm leading-[120%] tracking-[-0.09px] text-glass-text",
          "data-[placeholder]:text-text-muted",
          "outline-none",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="ml-auto">
          <ChevronDown size={16} className="text-glass-text" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={4}>
          <SelectPrimitive.Popup
            style={{ backgroundColor: "var(--glass-surface-elevated)" }}
            className={cn(
              "z-50 max-h-60 min-w-[var(--anchor-width)] overflow-hidden",
              "rounded-xl border border-glass-border",
              "shadow-lg shadow-black/40",
              "p-1",
              "data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95",
            )}
          >
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "relative flex h-9 cursor-pointer select-none items-center gap-2 rounded-lg px-3 pr-8",
                  "text-sm text-glass-text-secondary outline-none",
                  "data-[highlighted]:bg-hover data-[highlighted]:text-glass-text",
                  "data-[selected]:text-glass-text",
                )}
              >
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2">
                  <Check size={14} className="text-glass-text" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export { GlassSelect };
export type { GlassSelectProps };
