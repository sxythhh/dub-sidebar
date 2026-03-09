import { cn } from "@/lib/utils";

/**
 * Metallic orb background — inline style required because Tailwind v4 preflight
 * overrides `background` shorthand in CSS classes / @utility definitions.
 * Uses .join(", ") for a clean single-line string (no leading newlines).
 */
const ORB_BACKGROUND = [
  "radial-gradient(60.93% 50% at 51.43% 0%, var(--glass-orb-highlight) 0%, transparent 100%) padding-box",
  "linear-gradient(0deg, var(--orb-surface), var(--orb-surface)) padding-box",
  "linear-gradient(135deg, var(--card-gradient-end) 0%, transparent 35%, transparent 85%, var(--card-gradient-end) 100%) border-box",
  "var(--metallic-gradient) border-box",
].join(", ");

const ORB_SHADOW_SM = [
  "22.5px 33.3px 15.8px oklch(0 0 0 / 0.03)",
  "12.5px 19.2px 13.3px oklch(0 0 0 / 0.09)",
  "5.8px 8.3px 10px oklch(0 0 0 / 0.15)",
  "1.7px 2.5px 5.8px oklch(0 0 0 / 0.18)",
  "inset 0px 1.25px 0px var(--glass-inset)",
].join(", ");

const ORB_SHADOW_LG = [
  "27.5px 40.7px 19.4px oklch(0 0 0 / 0.03)",
  "15.3px 23.4px 16.3px oklch(0 0 0 / 0.09)",
  "7.1px 10.2px 12.2px oklch(0 0 0 / 0.15)",
  "2px 3.1px 7.1px oklch(0 0 0 / 0.18)",
  "inset 0px 1.53px 0px var(--glass-inset)",
].join(", ");

interface IconOrbProps {
  children: React.ReactNode;
  size?: 36 | 44;
}

function IconOrb({ children, size = 36 }: IconOrbProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: ORB_BACKGROUND,
        border: "0.83px solid transparent",
        boxShadow: size === 44 ? ORB_SHADOW_LG : ORB_SHADOW_SM,
        color: "oklch(1 0 0)",
      }}
      className="shrink-0 flex items-center justify-center rounded-full"
    >
      {children}
    </div>
  );
}

export { IconOrb, ORB_BACKGROUND, ORB_SHADOW_SM };
