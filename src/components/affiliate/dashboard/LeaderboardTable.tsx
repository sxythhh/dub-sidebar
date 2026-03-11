"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MonthlyLeaderboardEntry } from "@/types/affiliate.types";
import { LeaderboardTableRow } from "./LeaderboardTableRow";
import { glassCard } from "./styles";
import { springs } from "@/lib/springs";
import { useProximityHover } from "@/hooks/use-proximity-hover";

interface Props {
  entries: MonthlyLeaderboardEntry[];
}

export function LeaderboardTable({ entries }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems, entries]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      className="flex flex-col self-stretch overflow-x-auto"
      style={{
        ...glassCard,
        border: "1px solid var(--af-border-subtle)",
        gap: 16,
        padding: 16,
      }}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col items-end min-w-[480px]"
        style={{ gap: 12 }}
        onMouseEnter={handlers.onMouseEnter}
        onMouseMove={handlers.onMouseMove}
        onMouseLeave={handlers.onMouseLeave}
      >
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
              initial={{
                opacity: 0,
                top: activeRect.top,
                left: activeRect.left,
                width: activeRect.width,
                height: activeRect.height,
              }}
              animate={{
                opacity: 1,
                top: activeRect.top,
                left: activeRect.left,
                width: activeRect.width,
                height: activeRect.height,
              }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{
                ...springs.moderate,
                opacity: { duration: 0.16 },
              }}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div
          className="relative z-10 flex items-center justify-between self-stretch"
          style={{ gap: 16 }}
        >
          <div
            className="flex items-center"
            style={{ gap: 16, minWidth: 200 }}
          >
            <span
              className="text-xs text-center"
              style={{ color: "var(--af-text-muted)", width: 20 }}
            >
              #
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--af-text-muted)" }}
            >
              Affiliate
            </span>
          </div>
          <div className="flex items-center" style={{ gap: 16, width: 240 }}>
            <span
              className="text-xs"
              style={{ color: "var(--af-text-muted)", width: 120 }}
            >
              Referred
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--af-text-muted)", width: 120 }}
            >
              Clicks
            </span>
          </div>
        </div>
        <div
          className="relative z-10 self-stretch transition-[border-color] duration-75"
          style={{
            borderBottom: `1px solid ${activeIndex === 0 ? "transparent" : "var(--af-divider)"}`,
            height: 0,
          }}
        />
        {entries.map((entry, i) => (
          <LeaderboardTableRow
            entry={entry}
            key={entry.userId}
            index={i}
            registerItem={registerItem}
            activeIndex={activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
