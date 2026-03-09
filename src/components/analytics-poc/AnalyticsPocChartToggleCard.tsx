import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocPlatformIcon,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocChartToggleCardProps } from "./types";

type ToggleSurfaceStyle = CSSProperties & {
  "--ap-toggle-bg-hover": string;
  "--ap-toggle-border-hover": string;
  "--ap-toggle-label-color": string;
  "--ap-toggle-label-hover-color": string;
  "--ap-toggle-shadow-hover": string;
  "--ap-toggle-shadow-idle": string;
  "--ap-toggle-value-color": string;
  "--ap-toggle-value-hover-color": string;
};

const ACTIVE_SURFACE_STYLE: ToggleSurfaceStyle = {
  "--ap-toggle-bg-hover": "var(--ap-card-surface-hover)",
  "--ap-toggle-border-hover": "var(--ap-card-border-hover)",
  "--ap-toggle-label-color": "var(--ap-text)",
  "--ap-toggle-label-hover-color": "var(--ap-text)",
  "--ap-toggle-shadow-hover":
    "0 10px 20px rgba(0, 0, 0, 0.14), 0 2px 5px rgba(0, 0, 0, 0.08)",
  "--ap-toggle-shadow-idle":
    "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
  "--ap-toggle-value-color": "var(--ap-text)",
  "--ap-toggle-value-hover-color": "var(--ap-text)",
  background: "var(--ap-surface)",
  border: "1px solid var(--ap-surface-border)",
  borderRadius: 16,
  boxShadow: "var(--ap-toggle-shadow-idle)",
};

const INACTIVE_SURFACE_STYLE: ToggleSurfaceStyle = {
  "--ap-toggle-bg-hover": "var(--ap-inactive-surface)",
  "--ap-toggle-border-hover": "var(--ap-inactive-border)",
  "--ap-toggle-label-color": "var(--ap-text-secondary)",
  "--ap-toggle-label-hover-color": "var(--ap-text-strong)",
  "--ap-toggle-shadow-hover":
    "0 0 0 1px color-mix(in srgb, var(--ap-inactive-border) 100%, transparent)",
  "--ap-toggle-shadow-idle":
    "0 0 0 1px color-mix(in srgb, var(--ap-inactive-border) 100%, transparent)",
  "--ap-toggle-value-color": "var(--ap-text-secondary)",
  "--ap-toggle-value-hover-color": "var(--ap-text-strong)",
  background: "var(--ap-inactive-surface)",
  border: "1px solid var(--ap-inactive-border)",
  borderRadius: 16,
  boxShadow: "var(--ap-toggle-shadow-idle)",
};

const ACTIVE_BORDER_OVERLAY_STYLE: CSSProperties = {
  background: [
    "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.04) 100%)",
    "linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.05) 100%)",
    "linear-gradient(168deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 85%, rgba(255, 255, 255, 1) 100%)",
    "linear-gradient(168deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0) 85%, rgba(255, 255, 255, 0.2) 100%)",
  ].join(","),
  borderRadius: 16,
  inset: 0,
  maskComposite: "exclude",
  padding: "1px",
  pointerEvents: "none",
  position: "absolute",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
};

function PerformanceControl({ isEnabled }: { isEnabled: boolean }) {
  const style = {
    "--ap-toggle-control-border-color": isEnabled
      ? "var(--ap-text-strong)"
      : "var(--ap-text-quaternary)",
    "--ap-toggle-control-border-hover": isEnabled
      ? "var(--ap-text)"
      : "var(--ap-text-secondary)",
    borderColor: "var(--ap-toggle-control-border-color)",
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: isEnabled ? 5 : 1.5,
    boxSizing: "border-box",
    height: 14,
    transition:
      "border-width 380ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 320ms var(--ap-motion-ease-soft), transform var(--ap-motion-duration-hover) var(--ap-motion-ease-primary)",
    width: 14,
  } as CSSProperties;

  return (
    <span
      className="shrink-0 group-hover/chart-toggle:scale-[1.04] group-hover/chart-toggle:[--ap-toggle-control-border-color:var(--ap-toggle-control-border-hover)]"
      style={style}
    />
  );
}

export function AnalyticsPocChartToggleCard({
  label,
  value,
  metricKey,
  platform,
  dotColorClass = "bg-muted-foreground",
  enabled = true,
  isInteractive = false,
  onToggle,
  className,
}: AnalyticsPocChartToggleCardProps) {
  const isEnabled = enabled;
  const canToggle = Boolean(isInteractive && metricKey && onToggle);
  const showPlatformIcon = platform
    ? hasAnalyticsPocPlatformIcon(platform)
    : false;
  const containerClass = cn(
    "group/chart-toggle relative overflow-hidden min-h-[78px] p-4",
    "card-enter-anim [--enter-d:0]",
    "transform-gpu",
    "[box-shadow:var(--ap-toggle-shadow-idle)]",
    "transition-[box-shadow,border-color,background-color,transform] duration-[var(--ap-motion-duration-surface)] ease-[var(--ap-motion-ease-primary)]",
    "hover:translate-y-[var(--ap-card-lift-y)] hover:[box-shadow:var(--ap-toggle-shadow-hover)] hover:[border-color:var(--ap-toggle-border-hover)] hover:[background:var(--ap-toggle-bg-hover)]",
    "focus-visible:translate-y-[var(--ap-card-lift-y)] focus-visible:[box-shadow:var(--ap-toggle-shadow-hover)] focus-visible:[border-color:var(--ap-toggle-border-hover)] focus-visible:[background:var(--ap-toggle-bg-hover)]",
    "motion-reduce:transform-none motion-reduce:transition-none",
    className,
  );

  const content = (
    <>
      {isEnabled ? (
        <span
          style={
            {
              ...ACTIVE_BORDER_OVERLAY_STYLE,
              opacity: "var(--ap-card-shine-opacity)",
            } as CSSProperties
          }
        />
      ) : null}
      <div className="relative z-10 flex h-full flex-col gap-[10px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-[6px]">
            {platform && showPlatformIcon ? (
              <span className="inline-flex size-4 shrink-0 items-center justify-center">
                <AnalyticsPocPlatformIcon platform={platform} size={16} />
              </span>
            ) : (
              <span className={cn("size-2 rounded-full", dotColorClass)} />
            )}
            <p
              className={cn(
                "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px]",
                "transition-colors duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)]",
                "[color:var(--ap-toggle-label-color)] group-hover/chart-toggle:[color:var(--ap-toggle-label-hover-color)]",
              )}
            >
              {label}
            </p>
          </div>

          <PerformanceControl isEnabled={isEnabled} />
        </div>

        <p
          className={cn(
            "font-inter text-[16px] font-medium leading-[1.2] tracking-[-0.18px]",
            "transition-colors duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)]",
            "[color:var(--ap-toggle-value-color)] group-hover/chart-toggle:[color:var(--ap-toggle-value-hover-color)]",
          )}
        >
          {value}
        </p>
      </div>
    </>
  );

  if (!canToggle) {
    return (
      <article
        className={containerClass}
        style={isEnabled ? ACTIVE_SURFACE_STYLE : INACTIVE_SURFACE_STYLE}
      >
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
      aria-pressed={isEnabled}
      className={cn(
        containerClass,
        "cursor-pointer text-left active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-border)]",
      )}
      onClick={handleToggle}
      style={isEnabled ? ACTIVE_SURFACE_STYLE : INACTIVE_SURFACE_STYLE}
      type="button"
    >
      {content}
    </button>
  );
}
