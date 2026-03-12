import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type { AnalyticsPocPanelProps } from "./types";

const ANALYTICS_POC_PANEL_SURFACE_STYLE: CSSProperties = {
  background: "var(--ap-panel-surface)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
};

const PADDING_CLASS: Record<
  NonNullable<AnalyticsPocPanelProps["padding"]>,
  string
> = {
  lg: "p-5",
  md: "p-4",
  none: "p-0",
  sm: "p-3",
};

export function AnalyticsPocPanel({
  children,
  className,
  padding = "md",
}: AnalyticsPocPanelProps) {
  return (
    <section
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        PADDING_CLASS[padding],
        className,
      )}
      style={ANALYTICS_POC_PANEL_SURFACE_STYLE}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}
