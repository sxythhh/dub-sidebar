"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconOrb } from "./icon-orb";

/**
 * Inline styles required by the Tailwind v4 `background` shorthand bug —
 * these use mask-composite + background shorthand that cannot be split
 * into longhands and fail as @utility / CSS classes.
 */
const GLOW_BORDER: React.CSSProperties = {
  background:
    "linear-gradient(180deg, oklch(1 0 0 / 0) 33.87%, oklch(0.65 0.28 330 / 0.7) 59.52%, oklch(0.68 0.22 46) 100%)",
  padding: 4,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
  filter: "blur(20px)",
  borderRadius: 16,
  opacity: "var(--rc-glow-opacity)" as unknown as number,
};

const CARD_BORDER: React.CSSProperties = {
  background: "var(--rc-border-gradient)",
  padding: 1,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
  opacity: "var(--rc-border-opacity)" as unknown as number,
};

/* ── Context to expose group value to cards ── */

const RadioCardValueContext = React.createContext<string | undefined>(
  undefined,
);

/* ── RadioCardGroup ── */

interface RadioCardGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function RadioCardGroup({
  value,
  onValueChange,
  children,
  className,
}: RadioCardGroupProps) {
  return (
    <RadioCardValueContext.Provider value={value}>
      <RadioGroupPrimitive
        value={value}
        onValueChange={(val) => onValueChange?.(val as string)}
        className={cn("flex flex-col gap-3", className)}
      >
        {children}
      </RadioGroupPrimitive>
    </RadioCardValueContext.Provider>
  );
}

/* ── RadioCard ── */

interface RadioCardProps {
  value: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

function RadioCard({
  value,
  icon,
  title,
  description,
  className,
}: RadioCardProps) {
  const groupValue = React.useContext(RadioCardValueContext);
  const checked = groupValue === value;

  return (
    <RadioPrimitive.Root
      value={value}
      className={cn("relative rounded-2xl", className)}
    >
      {/* Glow border behind selected card (visible in light mode via opacity var) */}
      {checked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={GLOW_BORDER}
        />
      )}

      {/* Gradient border for unselected state */}
      {!checked && (
        <div
          className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
          style={CARD_BORDER}
        />
      )}

      <div
        className={cn(
          "relative flex w-full items-center gap-4 rounded-2xl h-[62px] py-3 pl-3 pr-4 text-left cursor-pointer",
          checked ? "glass-rc-selected" : "glass-rc-default",
        )}
      >
        {icon && <IconOrb>{icon}</IconOrb>}

        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <span className="text-sm font-medium leading-[120%] tracking-[-0.09px] text-glass-text">
            {title}
          </span>
          {description && (
            <span className="text-xs leading-[145%] text-glass-text-secondary">
              {description}
            </span>
          )}
        </div>

        {/* Radio indicator */}
        <div
          className={cn(
            "shrink-0 flex items-center justify-center size-5 rounded-full",
            checked ? "glass-radio-selected" : "glass-radio-unselected",
          )}
        >
          {checked && (
            <Check
              size={12}
              strokeWidth={3}
              className="text-background"
            />
          )}
        </div>
      </div>
    </RadioPrimitive.Root>
  );
}

export { RadioCardGroup, RadioCard };
