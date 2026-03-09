"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";
import { ORB_BACKGROUND, ORB_SHADOW_SM } from "./icon-orb";

const THUMB_STYLE: React.CSSProperties = {
  background: ORB_BACKGROUND,
  border: "0.83px solid transparent",
  boxShadow: ORB_SHADOW_SM,
};

interface SliderProps {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  dots?: number;
  className?: string;
  disabled?: boolean;
}

function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  dots,
  className,
  disabled,
}: SliderProps) {
  const fillPct = ((value[0] - min) / (max - min)) * 100;

  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={(val) => onValueChange?.(val as number[])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn("relative flex h-9 w-full touch-none select-none items-center", className)}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center">
        <SliderPrimitive.Track
          className="relative h-3 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10"
        >
          <SliderPrimitive.Indicator
            className="absolute inset-y-0 left-0 rounded-full glass-slider-gradient"
          />

          {dots != null && dots > 1 && (
            <>
              {Array.from({ length: dots }).map((_, i) => {
                const pct = (i / (dots - 1)) * 100;
                const isFilled = pct <= fillPct;
                return (
                  <div
                    key={i}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 rounded-full size-1.5 -ml-[3px]",
                      isFilled ? "bg-white/20" : "bg-black/20",
                    )}
                    style={{ left: `${pct}%` }}
                  />
                );
              })}
            </>
          )}
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className="flex size-9 items-center justify-center rounded-full cursor-grab active:cursor-grabbing focus:outline-none"
          style={THUMB_STYLE}
        >
          <div className="flex gap-[3px]">
            <div className="glass-slider-grip" />
            <div className="glass-slider-grip" />
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
