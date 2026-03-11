"use client";

import { ChevronDown } from "lucide-react";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { cn } from "@/lib/utils";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";

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
  const selectedPreset = presets.find((p) => p.value === value);
  const displayLabel = selectedPreset?.label ?? "Select range";

  const filters: Filter[] = [
    {
      key: "__date",
      icon: null,
      label: "Date range",
      singleSelect: true,
      options: presets.map((p) => ({
        value: p.value,
        label: p.label,
      })),
    },
  ];

  const activeFilters = value
    ? [{ key: "__date", values: [value] }]
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
          "inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--ap-border)] px-2.5",
          "font-inter text-[13px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]",
          "outline-none transition-colors",
          "bg-[var(--ap-select-bg)] hover:bg-[var(--ap-input-bg)]",
        )}
        type="button"
      >
        <CalendarIcon
          className="shrink-0 text-[var(--ap-text-secondary)]"
          height={14}
          width={14}
        />
        <span className="whitespace-nowrap">{displayLabel}</span>
        <ChevronDown className="size-3.5 shrink-0 text-[var(--ap-text-tertiary)]" />
      </button>
    </FilterSelect>
  );
}
