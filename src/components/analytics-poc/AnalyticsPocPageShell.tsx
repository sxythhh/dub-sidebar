import { ThemeDebugMenu } from "@/components/discover/shared/ThemeDebugMenu";
import { cn } from "@/lib/utils";
import type { AnalyticsPocPageShellProps } from "./types";

const AP_THEME_STYLES = `
:root {
  --ap-motion-duration-hover: 150ms;
  --ap-motion-duration-surface: 220ms;
  --ap-motion-duration-carousel: 180ms;
  --ap-motion-ease-primary: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ap-motion-ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --ap-card-lift-y: 0px;
  --ap-card-shadow: 0 1px 2px rgba(0,0,0,0.035);
  --ap-card-shadow-hover: 0 5px 12px rgba(0,0,0,0.075), 0 1px 2px rgba(0,0,0,0.05);
  --ap-card-border-hover: oklch(0 0 0 / 0.12);
  --ap-card-surface-hover: var(--card-bg);
  --ap-bg: #FBFBFB;
  --ap-surface: var(--card-bg);
  --ap-surface-border: var(--border);
  --ap-text: oklch(0 0 0);
  --ap-text-secondary: oklch(0 0 0 / 0.56);
  --ap-text-tertiary: oklch(0 0 0 / 0.40);
  --ap-text-quaternary: oklch(0 0 0 / 0.20);
  --ap-text-strong: oklch(0 0 0 / 0.72);
  --ap-text-heading: #444444;
  --ap-text-helper: #6B6B6B;
  --ap-icon: #6A6A6A;
  --ap-border: oklch(0 0 0 / 0.08);
  --ap-hover: oklch(0 0 0 / 0.06);
  --ap-share-hover-bg: rgba(0, 0, 0, 0.04);
  --ap-toggle-bg: rgba(234,232,230,0.6);
  --ap-toggle-thumb: #FFFFFF;
  --ap-pill-bg: rgba(255,255,255,0.60);
  --ap-pill-bg-solid: #F3F3F3;
  --ap-pill-border: #FFFFFF;
  --ap-column-highlight: rgba(255,255,255,0.30);
  --ap-tooltip-bg: linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05)), #151515;
  --ap-table-row-hover: oklch(0 0 0 / 0.03);
  --ap-select-bg: rgba(255,255,255,0.60);
  --ap-input-bg: #FFFFFF;
  --ap-badge-pill: rgba(255,255,255,0.60);
  --ap-panel-surface: var(--card-bg);
  --ap-inactive-surface: transparent;
  --ap-inactive-border: oklch(0 0 0 / 0.08);
  --ap-card-shine-opacity: 0;
  --ap-shadow-popup: 0 8px 30px rgba(0,0,0,0.12);
  --glass-action-btn-bg: var(--background);
}
html.dark {
  --ap-motion-duration-hover: 150ms;
  --ap-motion-duration-surface: 220ms;
  --ap-motion-duration-carousel: 180ms;
  --ap-motion-ease-primary: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ap-motion-ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --ap-card-lift-y: 0px;
  --ap-card-shadow: none;
  --ap-card-shadow-hover: 0 8px 18px rgba(0,0,0,0.34);
  --ap-card-border-hover: rgba(255,255,255,0.12);
  --ap-card-surface-hover: var(--card-bg);
  --ap-bg: #151515;
  --ap-surface: var(--card-bg);
  --ap-panel-surface: var(--card-bg);
  --ap-surface-border: var(--border);
  --ap-text: oklch(1 0 0 / 0.92);
  --ap-text-secondary: oklch(1 0 0 / 0.50);
  --ap-text-tertiary: oklch(1 0 0 / 0.34);
  --ap-text-quaternary: oklch(1 0 0 / 0.16);
  --ap-text-strong: oklch(1 0 0 / 0.72);
  --ap-text-heading: oklch(1 0 0 / 0.82);
  --ap-text-helper: oklch(1 0 0 / 0.50);
  --ap-icon: oklch(1 0 0 / 0.50);
  --ap-border: oklch(1 0 0 / 0.08);
  --ap-hover: oklch(1 0 0 / 0.06);
  --ap-share-hover-bg: rgba(255, 255, 255, 0.08);
  --ap-toggle-bg: oklch(1 0 0 / 0.06);
  --ap-toggle-thumb: #4a4a4a;
  --ap-pill-bg: rgba(255,255,255,0.07);
  --ap-pill-bg-solid: #2a2a2a;
  --ap-pill-border: rgba(255,255,255,0.06);
  --ap-column-highlight: rgba(255,255,255,0.05);
  --ap-tooltip-bg: linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05)), #151515;
  --ap-table-row-hover: oklch(1 0 0 / 0.03);
  --ap-select-bg: #2a2a2a;
  --ap-input-bg: #242424;
  --ap-badge-pill: rgba(255,255,255,0.08);
  --ap-inactive-surface: rgba(255,255,255,0.02);
  --ap-inactive-border: rgba(255,255,255,0.04);
  --ap-card-shine-opacity: 0;
  --ap-shadow-popup: 0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
  --glass-action-btn-bg: #2c2c2c;
}
@media (prefers-reduced-motion: reduce) {
  :root,
  html.dark {
    --ap-motion-duration-hover: 0ms;
    --ap-motion-duration-surface: 0ms;
    --ap-motion-duration-carousel: 0ms;
    --ap-card-lift-y: 0px;
  }
}
.ap-pill-gradient-border {
  background: linear-gradient(to bottom right, #ffffff 15%, rgba(0,0,0,0.12) 50%, #ffffff 85%);
}
html.dark .ap-pill-gradient-border {
  background: linear-gradient(to bottom right, rgba(255,255,255,0.10) 15%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.10) 85%);
}
`;

export function AnalyticsPocPageShell({
  children,
  className,
}: AnalyticsPocPageShellProps) {
  return (
    <>
      <style>{AP_THEME_STYLES}</style>
      <div
        className={cn(
          "min-h-screen select-none bg-[var(--ap-bg)]",
          className,
        )}
      >
        <ThemeDebugMenu />
        {children}
      </div>
    </>
  );
}
