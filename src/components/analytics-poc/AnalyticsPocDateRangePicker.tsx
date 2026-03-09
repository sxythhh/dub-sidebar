"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

export interface AnalyticsPocDateRangePreset {
  label: string;
  value: string;
}

const DEFAULT_PRESETS: AnalyticsPocDateRangePreset[] = [
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last 30 days", value: "last-30-days" },
  { label: "Last 90 days", value: "last-90-days" },
  { label: "Last 6 months", value: "last-6-months" },
  { label: "Last 12 months", value: "last-12-months" },
];

interface AnalyticsPocDateRangePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  presets?: AnalyticsPocDateRangePreset[];
  className?: string;
}

export function AnalyticsPocDateRangePicker({
  value,
  onValueChange,
  presets = DEFAULT_PRESETS,
  className,
}: AnalyticsPocDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedPreset = presets.find((p) => p.value === value);
  const displayLabel = selectedPreset?.label ?? "Select range";

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <button
        className={cn(
          "inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[10px] border border-[var(--ap-border)] px-2.5",
          "font-inter text-[13px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]",
          "outline-none transition-colors",
          open
            ? "bg-[var(--ap-input-bg)]"
            : "bg-[var(--ap-select-bg)]",
        )}
        onClick={() => setOpen((v) => !v)}
        ref={triggerRef}
        type="button"
      >
        <CalendarIcon
          className="shrink-0 text-[var(--ap-text-secondary)]"
          height={14}
          width={14}
        />
        <span className="whitespace-nowrap">{displayLabel}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-[var(--ap-text-tertiary)] transition-transform duration-200", open ? "rotate-0" : "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-[100] mt-1",
            "min-w-full w-max overflow-hidden rounded-[10px] border border-[var(--ap-border)] bg-[var(--ap-input-bg)] p-1",
            "shadow-[var(--ap-shadow-popup)]",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
          ref={containerRef}
        >
          {presets.map((preset) => (
            <button
              className={cn(
                ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                "relative flex h-8 w-full cursor-pointer select-none items-center rounded-lg px-2.5 pr-8",
                "font-inter text-[13px] font-normal text-[var(--ap-text-strong)] outline-none transition-colors",
                "hover:bg-black/[0.04] dark:hover:bg-white/[0.12]",
                value === preset.value && "text-[var(--ap-text)]",
              )}
              key={preset.value}
              onClick={() => {
                onValueChange(preset.value);
                setOpen(false);
              }}
              type="button"
            >
              {preset.label}
              {value === preset.value && (
                <Check className="absolute right-2 size-3.5 text-[var(--ap-text-secondary)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
