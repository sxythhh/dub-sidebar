import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const CARD_EFFECTS_GRAPHIC_MASK_STYLE: CSSProperties = {
  maskImage:
    "linear-gradient(90deg, rgba(0,0,0,0) 27.5%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,1) 100%)",
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "100% 100%",
  WebkitMaskImage:
    "linear-gradient(90deg, rgba(0,0,0,0) 27.5%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,1) 100%)",
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
};

const CARD_EFFECTS_GRAPHIC_LAYOUT_STYLE: CSSProperties = {
  height: "138%",
  left: "14%",
  top: "-16%",
  width: "98%",
};

function hexToRgba(color: string, alpha: number) {
  const fallback = [236, 62, 255] as const;
  const parsed = color.trim().replace("#", "");
  const normalized =
    parsed.length === 3
      ? parsed
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : parsed;

  if (normalized.length !== 6 || /[^0-9a-f]/i.test(normalized)) {
    return `rgba(${fallback[0]}, ${fallback[1]}, ${fallback[2]}, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function buildGlowStyle(accentColor: string): CSSProperties {
  const glowSoft = hexToRgba(accentColor, 0.08);
  const glowBase = hexToRgba(accentColor, 0.16);
  const glowStrong = hexToRgba(accentColor, 0.28);

  return {
    background: `
      radial-gradient(76% 114% at 50% 120%, ${glowStrong} 0%, ${glowBase} 36%, rgba(0,0,0,0) 72%),
      radial-gradient(36% 106% at 8% 116%, ${glowBase} 0%, rgba(0,0,0,0) 70%),
      radial-gradient(36% 106% at 92% 116%, ${glowBase} 0%, rgba(0,0,0,0) 70%),
      linear-gradient(180deg, rgba(0,0,0,0) 0%, ${glowSoft} 100%)
    `,
    maskImage:
      "linear-gradient(180deg, rgba(0,0,0,0) 66%, rgba(0,0,0,0.82) 88%, rgba(0,0,0,1) 100%)",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "100% 100%",
    WebkitMaskImage:
      "linear-gradient(180deg, rgba(0,0,0,0) 66%, rgba(0,0,0,0.82) 88%, rgba(0,0,0,1) 100%)",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
  };
}

interface AnalyticsPocCardEffectsLayerProps {
  accentColor: string;
  graphicSrc: string;
}

export function AnalyticsPocCardEffectsLayer({
  accentColor,
  graphicSrc,
}: AnalyticsPocCardEffectsLayerProps) {
  return (
    <div className="absolute inset-0">
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-[65.7895%] overflow-hidden",
        )}
        style={CARD_EFFECTS_GRAPHIC_MASK_STYLE}
      >
        <div className="absolute" style={CARD_EFFECTS_GRAPHIC_LAYOUT_STYLE}>
          <Image
            alt=""
            aria-hidden
            className={cn(
              "select-none object-contain opacity-90",
            )}
            draggable={false}
            fill
            sizes="(max-width: 768px) 60vw, 35vw"
            src={graphicSrc}
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-0 rounded-[16px] opacity-[0.225] blur-[16px]",
        )}
        style={buildGlowStyle(accentColor)}
      />
    </div>
  );
}
