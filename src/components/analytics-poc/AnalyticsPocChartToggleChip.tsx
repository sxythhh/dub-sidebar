import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

interface AnalyticsPocChartToggleChipProps {
  label: string;
  value: string;
  metricKey?: string;
  enabled?: boolean;
  onToggle?: (metricKey: string) => void;
  seriesColor: string;
  className?: string;
}

type ChipStyle = CSSProperties & {
  "--ap-chip-active-bg": string;
  "--ap-chip-active-bg-hover": string;
  "--ap-chip-active-border": string;
  "--ap-chip-active-border-hover": string;
  "--ap-chip-indicator-bg": string;
  "--ap-chip-indicator-bg-hover": string;
  "--ap-chip-indicator-border": string;
  "--ap-chip-indicator-border-hover": string;
};

function hexToRgb(color: string): [number, number, number] | null {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);

    if (hex.length === 3) {
      const r = Number.parseInt(hex[0] + hex[0], 16);
      const g = Number.parseInt(hex[1] + hex[1], 16);
      const b = Number.parseInt(hex[2] + hex[2], 16);

      if ([r, g, b].every(Number.isFinite)) {
        return [r, g, b];
      }
    }

    if (hex.length === 6) {
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);

      if ([r, g, b].every(Number.isFinite)) {
        return [r, g, b];
      }
    }

    return null;
  }

  const rgbMatch = normalized.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );

  if (!rgbMatch) {
    return null;
  }

  const r = Number.parseFloat(rgbMatch[1]);
  const g = Number.parseFloat(rgbMatch[2]);
  const b = Number.parseFloat(rgbMatch[3]);

  if (![r, g, b].every(Number.isFinite)) {
    return null;
  }

  return [r, g, b];
}

function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
  }

  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildChipStyle(seriesColor: string): ChipStyle {
  return {
    "--ap-chip-active-bg": `radial-gradient(42.53% 86.44% at 50.57% 0%, ${withAlpha(seriesColor, 0.144)} 0%, ${withAlpha(seriesColor, 0.072)} 100%)`,
    "--ap-chip-active-bg-hover": `radial-gradient(42.53% 86.44% at 50.57% 0%, ${withAlpha(seriesColor, 0.2)} 0%, ${withAlpha(seriesColor, 0.1)} 100%)`,
    "--ap-chip-active-border": withAlpha(seriesColor, 0.15),
    "--ap-chip-active-border-hover": withAlpha(seriesColor, 0.25),
    "--ap-chip-indicator-bg": seriesColor,
    "--ap-chip-indicator-bg-hover": seriesColor,
    "--ap-chip-indicator-border": seriesColor,
    "--ap-chip-indicator-border-hover": seriesColor,
  };
}

export function AnalyticsPocChartToggleChip({
  label,
  value,
  metricKey,
  enabled = true,
  onToggle,
  seriesColor,
  className,
}: AnalyticsPocChartToggleChipProps) {
  const canToggle = Boolean(metricKey && onToggle);
  const style = buildChipStyle(seriesColor);

  const indicator = enabled ? (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full border",
        "border-[var(--ap-chip-indicator-border)] bg-[var(--ap-chip-indicator-bg)]",
        "transition-[border-color,background-color] duration-150 ease-out",
        "group-hover/chip:border-[var(--ap-chip-indicator-border-hover)] group-hover/chip:bg-[var(--ap-chip-indicator-bg-hover)]",
      )}
    >
      <Check
        className="size-3"
        strokeWidth={2.25}
        style={{ color: "#FFFFFF" }}
      />
    </span>
  ) : (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 shrink-0 rounded-full border",
        "border-[var(--ap-text-quaternary)] bg-transparent",
        "transition-colors duration-150 ease-out",
        "group-hover/chip:border-[var(--ap-text-secondary)]",
      )}
    />
  );

  const chipClassName = cn(
    "group/chip inline-flex h-9 min-w-0 items-center justify-center gap-2 rounded-full px-3 py-2 pl-[10px]",
    "border text-left",
    "transition-[background,border-color,color] duration-150 ease-out",
    enabled
      ? "border-[var(--ap-chip-active-border)] [background:var(--ap-chip-active-bg)] hover:border-[var(--ap-chip-active-border-hover)] hover:[background:var(--ap-chip-active-bg-hover)]"
      : "border-[var(--ap-border)] bg-[var(--ap-inactive-surface)] hover:border-[var(--ap-border)]",
    canToggle
      ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-border)]"
      : "cursor-default",
    className,
  );

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-1">
        {indicator}
        <span
          className={cn(
            "truncate font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px]",
            enabled
              ? "text-[var(--ap-text-strong)]"
              : "text-[var(--ap-text-secondary)]",
          )}
        >
          {label}
        </span>
      </span>

      <span className="shrink-0 font-inter text-[14px] leading-[1.2] tracking-[-0.09px]">
        {(() => {
          const parts = value.split(" · ");
          if (parts.length < 2) {
            return (
              <span
                className="font-semibold"
                style={enabled ? { color: seriesColor } : undefined}
              >
                {value}
              </span>
            );
          }
          return (
            <>
              <span
                className="font-semibold"
                style={enabled ? { color: seriesColor } : undefined}
              >
                {parts[0]}
              </span>
              <span className="font-normal text-[var(--ap-text-secondary)]">
                {" · "}
                {parts.slice(1).join(" · ")}
              </span>
            </>
          );
        })()}
      </span>
    </>
  );

  if (!canToggle) {
    return (
      <article className={chipClassName} style={style}>
        {content}
      </article>
    );
  }

  const handleToggle = () => {
    if (metricKey && onToggle) {
      onToggle(metricKey);
    }
  };

  return (
    <button
      aria-pressed={enabled}
      className={cn(
        chipClassName,
        "active:scale-[0.97]",
      )}
      onClick={handleToggle}
      style={style}
      type="button"
    >
      {content}
    </button>
  );
}
