"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import {
  AnalyticsPocPlatformIcon,
} from "@/components/analytics-poc/AnalyticsPocPlatformIcon";

const TIME_FILTERS = ["This week", "This month", "All Time"];

const STAT_CARDS = [
  { label: "Budget", value: "$42,000" },
  { label: "Paid", value: "$42,000" },
  { label: "Pending", value: "$42,000" },
  { label: "Upcoming", value: "$42,000" },
  { label: "Clawed back", value: "$42,000" },
  { label: "Flagged", value: "$42,000" },
];

type PayoutStatus = "pending" | "paid" | "blocked" | "upcoming";

interface PayoutRow {
  id: string;
  name: string;
  platforms: ("tiktok" | "instagram" | "youtube" | "facebook")[];
  campaign: string;
  views: string;
  estPayout: string;
  net: string;
  status: PayoutStatus;
  flagged?: boolean;
}

const STATUS_CONFIG: Record<
  PayoutStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "#FF9025",
    bg: "rgba(255, 144, 37, 0.1)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#FF9025" strokeWidth="1.2" fill="none" />
        <path d="M6 3V6L8 7" stroke="#FF9025" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  paid: {
    label: "Paid",
    color: "#00B26E",
    bg: "rgba(0, 178, 110, 0.1)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#00B26E" strokeWidth="1.2" />
        <path d="M4 6L5.5 7.5L8 4.5" stroke="#00B26E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  blocked: {
    label: "Blocked",
    color: "#FF2525",
    bg: "rgba(255, 37, 37, 0.1)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#FF2525" strokeWidth="1.2" />
        <path d="M4 4L8 8M8 4L4 8" stroke="#FF2525" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  upcoming: {
    label: "Upcoming",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="#3B82F6" strokeWidth="1.2" fill="none" />
        <path d="M6 3V6L8 7" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

const PAYOUT_ROWS: PayoutRow[] = [
  { id: "1", name: "xKaizen", platforms: ["tiktok", "instagram", "youtube", "facebook"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "2", name: "Cryptoclipz", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "3", name: "ViralVince", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "4", name: "TechnoTrade", platforms: ["tiktok"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "blocked", flagged: true },
  { id: "5", name: "GamingGrace", platforms: ["tiktok", "instagram", "youtube"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "upcoming" },
  { id: "6", name: "BetBoss", platforms: ["tiktok", "instagram", "youtube", "facebook"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "7", name: "ClipKingJr", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "8", name: "NeonEdits", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "9", name: "ReelMaster", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
];

const AVATAR_COLORS = [
  "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EF4444", "#14B8A6", "#F97316",
];

function PlatformPill({ platform }: { platform: "tiktok" | "instagram" | "youtube" | "facebook" }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04] backdrop-blur-[12px]">
      <AnalyticsPocPlatformIcon platform={platform} size={14} tone="inherit" className="text-foreground/70" />
    </div>
  );
}

function Checkbox({ checked, onChange, indeterminate }: { checked: boolean; onChange: () => void; indeterminate?: boolean }) {
  const isActive = checked || indeterminate;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={cn(
        "flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border transition-colors",
        isActive
          ? "border-foreground/80 bg-foreground/80"
          : "border-foreground/[0.08] bg-card-bg shadow-[0_0.457px_0.914px_rgba(0,0,0,0.03)] dark:shadow-[0_0.457px_0.914px_rgba(0,0,0,0.15)]",
      )}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 5L4.5 7L7.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {indeterminate && !checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M3 5H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function PayoutTableRow({
  row,
  index,
  isLast,
  isSelected,
  isActive,
  onToggle,
  registerItem,
}: {
  row: PayoutRow;
  index: number;
  isLast: boolean;
  isSelected: boolean;
  isActive: boolean;
  onToggle: () => void;
  registerItem: (index: number, element: HTMLElement | null) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const status = STATUS_CONFIG[row.status];
  const isFlagged = row.flagged;

  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <div
      ref={rowRef}
      data-proximity-index={index}
      className={cn(
        "relative z-10 flex w-full cursor-pointer items-center px-1",
        isFlagged && "bg-[rgba(255,37,37,0.03)] dark:bg-[rgba(255,37,37,0.06)]",
        isSelected && !isFlagged && "bg-foreground/[0.02]",
      )}
    >
      <div className="flex h-14 w-12 items-center justify-center px-3 pr-5">
        <Checkbox checked={isSelected} onChange={onToggle} />
      </div>
      <div
        className={cn(
          "flex flex-1 items-center transition-[border-color] duration-75",
          !isLast && (isActive ? "border-b border-transparent" : "border-b border-foreground/[0.03]"),
        )}
      >
        {/* Creator */}
        <div className="flex h-14 w-[240px] items-center gap-2 py-3 pr-3">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-medium text-white"
            style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
          >
            {row.name[0]}
          </div>
          <span
            className={cn(
              "font-[family-name:var(--font-inter)] text-sm font-medium leading-none tracking-[-0.02em]",
              isFlagged ? "text-[#FF2525]" : "text-page-text",
            )}
          >
            {row.name}
          </span>
        </div>

        {/* Platforms */}
        <div className="flex h-14 w-[132px] items-center justify-end py-3 pl-5 pr-3">
          <div className="flex items-center gap-1">
            {row.platforms.map((p) => (
              <PlatformPill key={p} platform={p} />
            ))}
          </div>
        </div>

        {/* Campaign */}
        <div className="flex h-14 min-w-0 flex-1 items-center justify-end py-3 pl-5 pr-3">
          <span className="font-[family-name:var(--font-inter)] text-xs leading-none tracking-[-0.02em] text-page-text">
            {row.campaign}
          </span>
        </div>

        {/* Views */}
        <div className="flex h-14 min-w-0 flex-1 items-center justify-end py-3 pl-5 pr-3">
          <span
            className={cn(
              "font-[family-name:var(--font-inter)] text-xs leading-none tracking-[-0.02em]",
              isFlagged ? "text-[rgba(255,37,37,0.7)]" : "text-page-text",
            )}
          >
            {row.views}
          </span>
        </div>

        {/* Est. payout */}
        <div className="flex h-14 min-w-0 flex-1 items-center justify-end py-3 pl-5 pr-3">
          <span
            className={cn(
              "font-[family-name:var(--font-inter)] text-xs font-medium leading-none tracking-[-0.02em]",
              isFlagged ? "text-[#FF2525]" : "text-[#00B26E]",
            )}
          >
            {row.estPayout}
          </span>
        </div>

        {/* Net */}
        <div className="flex h-14 min-w-0 flex-1 items-center justify-end py-3 pl-5 pr-3">
          <span
            className={cn(
              "font-[family-name:var(--font-inter)] text-xs leading-none tracking-[-0.02em]",
              isFlagged ? "text-[rgba(255,37,37,0.7)]" : "text-page-text",
            )}
          >
            {row.net}
          </span>
        </div>

        {/* Status */}
        <div className="flex h-14 min-w-0 flex-1 items-center justify-end py-3 pl-5 pr-3">
          <div
            className="flex items-center gap-1 rounded-full py-2 pr-2 pl-1.5"
            style={{ backgroundColor: status.bg }}
          >
            {status.icon}
            <span
              className="font-[family-name:var(--font-inter)] text-xs font-medium leading-none tracking-[-0.02em]"
              style={{ color: status.color }}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Chevron - visible on hover */}
        <div className="flex h-14 w-20 items-center justify-end py-3 pl-5 pr-3 text-foreground">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn(
              "transition-opacity duration-150",
              isActive ? "opacity-100" : "opacity-0",
            )}
          >
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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
  }, [measureItems]);

  const allIds = PAYOUT_ROWS.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = allIds.some((id) => selectedIds.has(id));

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (allIds.every((id) => prev.has(id))) return new Set();
      return new Set(allIds);
    });
  }, [allIds]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Payouts
          </span>
        </div>

        {/* Time filter */}
        <div className="flex items-center gap-0.5 rounded-xl bg-accent p-0.5">
          {TIME_FILTERS.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className={cn(
                "flex h-8 items-center rounded-[10px] px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] transition-all",
                activeFilter === i
                  ? "bg-card-bg text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                  : "cursor-pointer text-page-text-muted hover:text-page-text-subtle",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        {/* Stat cards row */}
        <div className="flex flex-row items-start gap-2">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">
                  {card.value}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-[family-name:var(--font-inter)] text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex flex-col items-start justify-center overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {/* Header row */}
          <div className="flex w-full items-center border-b border-card-border px-1">
            <div className="flex h-10 w-12 items-center justify-center px-3 pr-5">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
            </div>
            <div className="flex flex-1 items-center">
              {["Creator", "Platforms", "Campaign", "Views", "Est. payout", "Net", "Status"].map((col, idx) => (
                <div
                  key={col}
                  className={cn(
                    "flex h-9 items-center py-3 pl-5 pr-3",
                    idx === 0 ? "w-[240px] pl-0" : idx === 1 ? "w-[132px] justify-end" : "min-w-0 flex-1 justify-end",
                  )}
                >
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium leading-none tracking-[-0.02em] text-page-text-muted">
                    {col}
                  </span>
                </div>
              ))}
              <div className="flex h-9 w-20 items-center justify-end py-3 pl-5 pr-4">
                <span className="text-page-text-muted opacity-0">Status</span>
              </div>
            </div>
          </div>

          {/* Data rows with proximity hover */}
          <div
            ref={containerRef}
            className="relative w-full"
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

            {PAYOUT_ROWS.map((row, i) => (
              <PayoutTableRow
                key={row.id}
                row={row}
                index={i}
                isLast={i === PAYOUT_ROWS.length - 1}
                isSelected={selectedIds.has(row.id)}
                isActive={activeIndex === i}
                onToggle={() => toggleRow(row.id)}
                registerItem={registerItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
