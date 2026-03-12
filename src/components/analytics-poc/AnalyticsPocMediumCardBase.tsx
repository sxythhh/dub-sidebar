import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";

interface AnalyticsPocMediumCardBaseProps {
  children: ReactNode;
  effectsLayer?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AnalyticsPocMediumCardBase({
  children,
  effectsLayer,
  className,
  style,
}: AnalyticsPocMediumCardBaseProps) {
  return (
    <section
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "min-h-[194px] p-4",
        className,
      )}
      style={{ ...ANALYTICS_POC_CARD_SURFACE_STYLE, ...style }}
    >
      {effectsLayer ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          {effectsLayer}
        </div>
      ) : null}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </section>
  );
}
