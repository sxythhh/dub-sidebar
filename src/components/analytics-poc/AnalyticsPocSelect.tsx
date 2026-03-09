"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

export interface AnalyticsPocSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface AnalyticsPocSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: AnalyticsPocSelectOption[];
  className?: string;
}

export function AnalyticsPocSelect({
  value,
  onValueChange,
  placeholder = "Select\u2026",
  options,
  className,
}: AnalyticsPocSelectProps) {
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

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

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
        {selectedOption?.icon ? (
          <span className="flex shrink-0 items-center justify-center">
            {selectedOption.icon}
          </span>
        ) : null}
        <span className="whitespace-nowrap">{displayLabel}</span>
        <ChevronDown className={cn("ml-0.5 size-3.5 shrink-0 text-[var(--ap-text-tertiary)] transition-transform duration-200", open ? "rotate-0" : "rotate-180")} />
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
          {options.map((opt) => (
            <button
              className={cn(
                ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                "relative flex h-8 w-full cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-lg px-2.5 pr-8",
                "font-inter text-[13px] font-normal text-[var(--ap-text-strong)] outline-none transition-colors",
                "hover:bg-black/[0.04] dark:hover:bg-white/[0.12]",
                value === opt.value && "text-[var(--ap-text)]",
              )}
              key={opt.value}
              onClick={() => {
                onValueChange(opt.value);
                setOpen(false);
              }}
              type="button"
            >
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              {opt.label}
              {value === opt.value && (
                <Check className="absolute right-2 size-3.5 text-[var(--ap-text-secondary)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
