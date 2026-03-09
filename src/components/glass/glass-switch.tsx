"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

/**
 * Inline style objects required — Tailwind v4 preflight sets
 * background-color: transparent on buttons, and translate-x-*
 * classes don't reliably animate on Base UI Switch.Thumb.
 */
const TRACK_CHECKED: React.CSSProperties = {
  backgroundColor: "var(--toggle-track)",
  backgroundImage: [
    "radial-gradient(31.76% 50.52% at 64.86% 100.52%, var(--accent-pink) 0%, transparent 100%)",
    "radial-gradient(31.58% 54.43% at 32.86% 102.32%, var(--accent-orange) 0%, transparent 100%)",
    "radial-gradient(42.53% 86.44% at 50.57% 0%, var(--toggle-glow) 0%, var(--toggle-track) 100%)",
  ].join(", "),
  backdropFilter: "blur(6px)",
};

const TRACK_UNCHECKED: React.CSSProperties = {
  backgroundColor: "var(--hover)",
  backgroundImage:
    "radial-gradient(42.53% 86.44% at 50.57% 0%, var(--glass-tint) 0%, var(--glass-subtle) 100%)",
  backdropFilter: "blur(6px)",
};

const THUMB_BASE: React.CSSProperties = {
  width: 20,
  height: 16,
  backgroundColor: "oklch(1 0 0 / 0.88)",
  boxShadow: "0px 2px 4px oklch(0 0 0 / 0.2)",
};

function GlassSwitch({
  className,
  checked,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      style={checked ? TRACK_CHECKED : TRACK_UNCHECKED}
      className={cn(
        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block rounded-full transition-all duration-150"
        style={{
          ...THUMB_BASE,
          transform: checked ? "translateX(16px)" : "translateX(0px)",
        }}
      />
    </SwitchPrimitive.Root>
  );
}

export { GlassSwitch };
