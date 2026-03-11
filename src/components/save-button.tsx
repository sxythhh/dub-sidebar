"use client";
import { useState, useCallback } from "react";

type SaveState = "idle" | "saving" | "saved";

export function SaveButton({ onSave }: { onSave?: () => Promise<void> | void }) {
  const [state, setState] = useState<SaveState>("idle");

  const handleClick = useCallback(async () => {
    if (state === "saving") return;
    setState("saving");
    try {
      await onSave?.();
    } catch {
      // reset on error
    }
    setState("saved");
    setTimeout(() => setState("idle"), 2000);
  }, [onSave, state]);

  return (
    <button
      onClick={handleClick}
      disabled={state === "saving"}
      className="relative flex h-[44px] flex-row items-center overflow-visible rounded-[30px] bg-[#222222] pl-[26px] pr-[20px] transition-all hover:bg-[#333333] active:scale-[0.97] disabled:opacity-80"
    >
      <span className="font-[family-name:var(--font-inter)] text-[16px] font-semibold leading-[16px] tracking-[-0.48px] text-white">
        Sav
      </span>

      <span className="relative w-[20px]">
        {/* "ed" text — saved state */}
        <span
          className="inline-flex items-center font-[family-name:var(--font-inter)] text-[16px] font-semibold leading-[16px] tracking-[-0.32px] text-white transition-opacity duration-300"
          style={{ opacity: state === "saved" ? 1 : 0 }}
        >
          ed
        </span>

        {/* "e" — default idle state */}
        <span
          className="absolute inset-0 inline-flex items-center font-[family-name:var(--font-inter)] text-[16px] font-semibold leading-[16px] tracking-[-0.32px] text-white transition-opacity duration-300"
          style={{ opacity: state === "idle" ? 1 : 0 }}
        >
          e
        </span>
      </span>

      {/* Icon — 22x22 circle, absolutely positioned on the right edge of the pill */}
      <span
        className="absolute right-0 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-[12px] bg-[#222222] transition-opacity duration-300"
        style={{ opacity: state === "idle" ? 0 : 1 }}
      >
        {/* Ring border track */}
        <span className="absolute inset-0 rounded-[12px] border-2 border-white/[0.24]" />

        {/* Spinning conic gradient arc */}
        <span
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: state === "saving" ? 1 : 0 }}
        >
          <svg
            className="h-full w-full animate-spin"
            viewBox="0 0 22 22"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="10"
              stroke="transparent"
              strokeWidth="2"
            />
            <path
              d="M11 1a10 10 0 0 1 10 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* Solid white border ring — visible on saved */}
        <span
          className="absolute inset-0 rounded-[12px] border-2 border-white transition-opacity duration-300"
          style={{ opacity: state === "saved" ? 1 : 0 }}
        />

        {/* Checkmark tick — 16x16, inset 3px */}
        <svg
          className="relative z-10 h-[16px] w-[16px] transition-opacity duration-300"
          style={{ opacity: state === "saved" ? 1 : 0 }}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
