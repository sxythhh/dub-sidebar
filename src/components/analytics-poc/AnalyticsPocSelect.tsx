"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";

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
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  // Wrap options as a single-key filter for FilterSelect
  const filters: Filter[] = [
    {
      key: "__select",
      icon: null,
      label: placeholder.replace("…", ""),
      singleSelect: true,
      options: options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
      })),
    },
  ];

  const activeFilters = value
    ? [{ key: "__select", values: [value] }]
    : [];

  return (
    <FilterSelect
      filters={filters}
      activeFilters={activeFilters}
      onSelect={(_key, val) => {
        const v = Array.isArray(val) ? val[0] : val;
        onValueChange(v);
      }}
      onRemove={() => {}}
      placement="bottom-end"
      className={className}
    >
      <button
        className={cn(
          "inline-flex h-[34px] max-w-[200px] cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--ap-border)] px-2.5",
          "font-inter text-[13px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]",
          "outline-none transition-colors",
          "bg-[var(--ap-select-bg)] hover:bg-[var(--ap-input-bg)]",
        )}
        type="button"
      >
        {selectedOption?.icon ? (
          <span className="flex shrink-0 items-center justify-center">
            {selectedOption.icon}
          </span>
        ) : null}
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="ml-0.5 size-3.5 shrink-0 text-[var(--ap-text-tertiary)]" />
      </button>
    </FilterSelect>
  );
}
