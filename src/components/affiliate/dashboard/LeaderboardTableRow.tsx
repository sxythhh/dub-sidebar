"use client";

import { useRef, useEffect } from "react";
import { CrownIcon } from "./icons";
import type { MonthlyLeaderboardEntry } from "@/types/affiliate.types";

interface Props {
  entry: MonthlyLeaderboardEntry;
  index: number;
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

export function LeaderboardTableRow({ entry, index, registerItem, activeIndex }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const rankColor =
    entry.rank === 2 ? "#7C8B99" : entry.rank === 3 ? "#7D4C18" : undefined;

  const hideBorder =
    activeIndex !== null && (index === activeIndex || index === activeIndex - 1);

  return (
    <>
      <div
        ref={rowRef}
        data-proximity-index={index}
        className="relative z-10 flex items-center justify-between self-stretch"
        style={{ gap: 16, height: 24 }}
      >
        <div className="flex items-center" style={{ gap: 16, minWidth: 200 }}>
          {entry.rank === 1 ? (
            <CrownIcon
              size={19}
              style={{ color: "#F1A624", flexShrink: 0 }}
            />
          ) : (
            <span
              className="text-sm text-center shrink-0"
              style={{
                color: rankColor || "var(--af-text-muted)",
                fontWeight: rankColor ? 600 : 400,
                letterSpacing: "-0.09px",
                lineHeight: "120%",
                width: 20,
              }}
            >
              {entry.rank}
            </span>
          )}
          <div className="flex items-center" style={{ gap: 8 }}>
            {entry.avatarUrl ? (
              <img
                alt=""
                height={24}
                src={entry.avatarUrl}
                style={{
                  borderRadius: "50%",
                  flexShrink: 0,
                  objectFit: "cover",
                }}
                width={24}
              />
            ) : (
              <span
                className="flex items-center justify-center text-[10px] font-semibold uppercase"
                style={{
                  backgroundColor: "var(--af-bg-input)",
                  borderRadius: "50%",
                  color: "var(--af-text-muted)",
                  flexShrink: 0,
                  height: 24,
                  width: 24,
                }}
              >
                {entry.name.charAt(0)}
              </span>
            )}
            <span
              className="text-sm font-medium whitespace-nowrap"
              style={{
                color: "var(--af-text)",
                letterSpacing: "-0.09px",
                lineHeight: "120%",
              }}
            >
              {entry.name}
              {entry.isCurrentUser && (
                <span
                  className="ml-1.5 text-xs"
                  style={{ color: "var(--af-text-muted)" }}
                >
                  (you)
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 16, width: 240 }}>
          <span
            className="text-sm"
            style={{
              color: "var(--af-text-secondary)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
              width: 120,
            }}
          >
            {entry.referrals}
          </span>
          <span
            className="text-sm"
            style={{
              color: "var(--af-text-secondary)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
              width: 120,
            }}
          >
            {entry.clicks}
          </span>
        </div>
      </div>
      <div
        className="relative z-10 self-stretch transition-[border-color] duration-75"
        style={{
          borderBottom: `1px solid ${hideBorder ? "transparent" : "var(--af-divider)"}`,
          height: 0,
        }}
      />
    </>
  );
}
