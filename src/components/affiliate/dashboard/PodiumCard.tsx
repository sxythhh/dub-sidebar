"use client";

import { PodiumStars } from "./PodiumStars";
import { CrownIcon } from "./icons";
import type { PodiumStyle } from "./podium-styles";

export type { PodiumStyle };
export { PODIUM_STYLES } from "./podium-styles";

interface Props {
  style: PodiumStyle;
  name: string;
  stat: string;
  avatarUrl: string | null;
}

export function PodiumCard({ style, name, stat, avatarUrl }: Props) {
  return (
    <div
      className="flex flex-col items-start flex-1 relative overflow-hidden"
      style={{
        background: style.gradient,
        borderRadius: 16,
        height: style.height,
        isolation: "isolate",
        padding: 16,
      }}
    >
      <PodiumStars color={style.accent} id={`star-${style.rank}`} />
      <span
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${style.accent}00 0%, ${style.accent}3D 50%, ${style.accent}00 100%)`,
          zIndex: 2,
        }}
      />
      <span
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${style.accent}00 0%, ${style.accent}3D 50%, ${style.accent}00 100%)`,
          zIndex: 2,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          background: `linear-gradient(179.9deg, ${style.accent} 0.08%, ${style.accent}00 99.92%)`,
          filter: "blur(12px)",
          height: 424,
          left: "50%",
          opacity: style.glowOpacity,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 373,
          zIndex: 1,
        }}
      />
      <div
        className="flex flex-col items-center justify-end flex-1 w-full relative"
        style={{
          gap: style.rank === 1 ? 8 : 4,
          paddingBottom: 24,
          paddingTop: style.rank === 1 ? 0 : 24,
          zIndex: 3,
        }}
      >
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          {style.rank === 1 && (
            <CrownIcon size={19} style={{ color: "#F1A624" }} />
          )}
          {avatarUrl ? (
            <img
              alt=""
              height={style.avatarSize}
              src={avatarUrl}
              style={{
                borderRadius: "50%",
                boxShadow: `0 0 0 ${style.avatarSize / 28}px ${style.border}`,
                flexShrink: 0,
                objectFit: "cover",
              }}
              width={style.avatarSize}
            />
          ) : (
            <span
              className="flex items-center justify-center font-semibold uppercase"
              style={{
                background: `linear-gradient(135deg, ${style.accent}40, ${style.accent}20)`,
                borderRadius: "50%",
                boxShadow: `0 0 0 ${style.avatarSize / 28}px ${style.border}`,
                color: style.accent,
                flexShrink: 0,
                fontSize: style.avatarSize * 0.35,
                height: style.avatarSize,
                width: style.avatarSize,
              }}
            >
              {name.charAt(0)}
            </span>
          )}
          <span
            className="font-medium text-center"
            style={{
              color: "var(--af-text)",
              fontSize: 16.8,
              letterSpacing: "-0.108px",
              lineHeight: "120%",
            }}
          >
            {name}
          </span>
          <div
            style={{
              background: [
                `linear-gradient(180deg, ${style.border} 0%, transparent 100%)`,
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 85%, #FFFFFF 100%)",
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.2) 100%)",
              ].join(", "),
              borderRadius: 1200,
              padding: 1,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                backdropFilter: "blur(7.2px)",
                background: style.pillBg,
                borderRadius: 1200,
                padding: "3px 9px",
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: style.textColor, lineHeight: "20px" }}
              >
                {stat}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
