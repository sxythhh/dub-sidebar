"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { key: string; label: string }[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

function Stepper({ steps, currentIndex, onStepClick }: StepperProps) {
  return (
    <nav className="flex flex-col gap-1 py-2">
      {steps.map((step, i) => {
        const isPast = i < currentIndex;
        const isActive = i === currentIndex;
        const isClickable = isPast && !!onStepClick;

        return (
          <button
            key={step.key}
            type="button"
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-3 rounded-xl h-10 px-3 text-left transition-colors text-sm tracking-[-0.09px]",
              isActive && "glass-stepper-active-bg",
              isPast && "hover:bg-hover cursor-pointer",
              !isPast && !isActive && "cursor-default",
            )}
            onClick={() => isClickable && onStepClick(i)}
          >
            <span
              className={cn(
                "flex shrink-0 items-center justify-center w-4 h-4",
                isActive
                  ? "text-glass-text font-medium"
                  : isPast
                    ? "text-glass-text-secondary"
                    : "text-text-faint",
              )}
            >
              {isPast ? (
                <Check size={12} strokeWidth={1.5} />
              ) : (
                <span className="text-sm">{i + 1}.</span>
              )}
            </span>
            <span
              className={cn(
                isActive
                  ? "text-glass-text font-medium"
                  : "text-glass-text-secondary",
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export { Stepper };
