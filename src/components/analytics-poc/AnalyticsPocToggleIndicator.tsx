import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// --- Option A: Ring fill — snappy spring (150ms) ---
export function ToggleIndicatorA({ isEnabled }: { isEnabled: boolean }) {
  const style: CSSProperties = {
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: isEnabled ? 6 : 1.5,
    borderColor: isEnabled ? "var(--ap-text-strong)" : "var(--ap-text-quaternary)",
    width: 18,
    height: 18,
    boxSizing: "border-box",
    transition: "border-width 150ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 150ms ease",
  };
  return <span style={style} />;
}

// --- Option B: Ring fill — smooth decel (250ms) ---
export function ToggleIndicatorB({ isEnabled }: { isEnabled: boolean }) {
  const style: CSSProperties = {
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: isEnabled ? 6 : 1.5,
    borderColor: isEnabled ? "var(--ap-text-strong)" : "var(--ap-text-quaternary)",
    width: 18,
    height: 18,
    boxSizing: "border-box",
    transition: "border-width 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease",
  };
  return <span style={style} />;
}

// --- Option C: Checkmark — instant bg, check scales in fast (120ms) ---
export function ToggleIndicatorC({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span
      className={cn(
        "flex size-[18px] items-center justify-center rounded-full",
        isEnabled ? "bg-[var(--ap-text-strong)]" : "border border-[var(--ap-text-quaternary)] bg-transparent",
      )}
      style={{ transition: "background-color 100ms ease, border-color 100ms ease" }}
    >
      <Check
        className="text-white"
        strokeWidth={3}
        style={{
          width: isEnabled ? 12 : 0,
          height: isEnabled ? 12 : 0,
          opacity: isEnabled ? 1 : 0,
          transition: "width 120ms cubic-bezier(0.34, 1.56, 0.64, 1), height 120ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 80ms ease",
        }}
      />
    </span>
  );
}

// --- Option D: Checkmark — smooth spring, slightly larger (180ms) ---
export function ToggleIndicatorD({ isEnabled }: { isEnabled: boolean }) {
  return (
    <span
      className={cn(
        "flex size-[18px] items-center justify-center rounded-full",
        isEnabled ? "bg-[var(--ap-text-strong)]" : "border border-[var(--ap-text-quaternary)] bg-transparent",
      )}
      style={{ transition: "background-color 180ms ease, border-color 180ms ease" }}
    >
      <Check
        className="text-white"
        strokeWidth={2.5}
        style={{
          width: 12,
          height: 12,
          opacity: isEnabled ? 1 : 0,
          transform: isEnabled ? "scale(1)" : "scale(0.5)",
          transition: "opacity 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </span>
  );
}
