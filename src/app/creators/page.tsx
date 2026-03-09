"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { fontWeights } from "@/lib/font-weight";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { PlatformIcon } from "@/components/icons/PlatformIcon";

// ── Subtle Tab primitives (same as submissions) ─────────────────────

interface TabContextValue {
  registerTab: (index: number, element: HTMLElement | null) => void;
  hoveredIndex: number | null;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within Tabs");
  return ctx;
}

const Tabs = forwardRef<
  HTMLDivElement,
  Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    children: ReactNode;
    selectedIndex: number;
    onSelect: (index: number) => void;
  }
>(({ children, selectedIndex, onSelect, className, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseInside = useRef(false);

  const {
    activeIndex: hoveredIndex,
    itemRects: tabRects,
    handlers,
    registerItem: registerTab,
    measureItems: measureTabs,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => {
    measureTabs();
  }, [measureTabs, children]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      isMouseInside.current = true;
      handlers.onMouseMove(e);
    },
    [handlers],
  );

  const handleMouseLeave = useCallback(() => {
    isMouseInside.current = false;
    handlers.onMouseLeave();
  }, [handlers]);

  const selectedRect = tabRects[selectedIndex];
  const hoverRect = hoveredIndex !== null ? tabRects[hoveredIndex] : null;
  const isHoveringSelected = hoveredIndex === selectedIndex;
  const isHovering = hoveredIndex !== null && !isHoveringSelected;

  return (
    <TabContext.Provider
      value={{ registerTab, hoveredIndex, selectedIndex, onSelect }}
    >
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (
              ref as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative flex items-center gap-0.5 rounded-2xl bg-accent p-0.5 select-none",
          className,
        )}
        role="tablist"
        {...props}
      >
        {selectedRect && (
          <motion.div
            className="pointer-events-none absolute rounded-xl bg-card-bg shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-white/[0.10] dark:shadow-none"
            initial={false}
            animate={{
              left: selectedRect.left,
              width: selectedRect.width,
              top: selectedRect.top,
              height: selectedRect.height,
              opacity: isHovering ? 0.85 : 1,
            }}
            transition={{
              ...springs.moderate,
              opacity: { duration: 0.16 },
            }}
          />
        )}

        <AnimatePresence>
          {hoverRect && !isHoveringSelected && selectedRect && (
            <motion.div
              className="pointer-events-none absolute rounded-xl bg-accent dark:bg-white/[0.06]"
              initial={{
                left: selectedRect.left,
                width: selectedRect.width,
                top: selectedRect.top,
                height: selectedRect.height,
                opacity: 0,
              }}
              animate={{
                left: hoverRect.left,
                width: hoverRect.width,
                top: hoverRect.top,
                height: hoverRect.height,
                opacity: 1,
              }}
              exit={
                !isMouseInside.current && selectedRect
                  ? {
                      left: selectedRect.left,
                      width: selectedRect.width,
                      top: selectedRect.top,
                      height: selectedRect.height,
                      opacity: 0,
                      transition: {
                        ...springs.moderate,
                        opacity: { duration: 0.12 },
                      },
                    }
                  : { opacity: 0, transition: { duration: 0.12 } }
              }
              transition={{
                ...springs.moderate,
                opacity: { duration: 0.16 },
              }}
            />
          )}
        </AnimatePresence>

        {children}
      </div>
    </TabContext.Provider>
  );
});
Tabs.displayName = "Tabs";

const TabItem = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    label: string;
    count: number;
    index: number;
  }
>(({ label, count, index, className, ...props }, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const { registerTab, hoveredIndex, selectedIndex, onSelect } = useTab();

  useEffect(() => {
    registerTab(index, internalRef.current);
    return () => registerTab(index, null);
  }, [index, registerTab]);

  const isSelected = selectedIndex === index;
  const isHovered = hoveredIndex === index;

  return (
    <button
      ref={(node) => {
        (
          internalRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (
            ref as React.MutableRefObject<HTMLButtonElement | null>
          ).current = node;
      }}
      data-proximity-index={index}
      role="tab"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(index)}
      className={cn(
        "relative z-10 flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border-none bg-transparent px-4 font-[family-name:var(--font-inter)] tracking-[-0.02em] outline-none",
        className,
      )}
      {...props}
    >
      <span className="inline-grid text-sm">
        <span
          className="invisible col-start-1 row-start-1"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-75",
            isSelected || isHovered
              ? "text-page-text"
              : "text-page-text-subtle",
          )}
          style={{
            fontVariationSettings: isSelected
              ? fontWeights.semibold
              : fontWeights.medium,
          }}
        >
          {label}
        </span>
      </span>
      <span className="text-sm font-normal text-page-text-muted">
        {count}
      </span>
    </button>
  );
});
TabItem.displayName = "TabItem";

// ── Filter Icon ─────────────────────────────────────────────────────

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 0.75H12.75M4.75 10.0833H8.75M2.75 5.41667H10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Platform Badge ───────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-accent text-page-text-subtle">
      <PlatformIcon platform={platform} size={12} />
    </div>
  );
}

// ── Score Circle ─────────────────────────────────────────────────────

function ScoreCircle({ value, color = "currentColor" }: { value: number; color?: string }) {
  const r = 5;
  const circumference = 2 * Math.PI * r;
  const filled = (value / 100) * circumference;
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="-rotate-90">
      <circle cx="6" cy="6" r={r} stroke={color} strokeWidth="1.33" opacity={0.2} />
      <circle
        cx="6"
        cy="6"
        r={r}
        stroke={color}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
      />
    </svg>
  );
}

// ── Creators Table with proximity hover ─────────────────────────────

type Platform = "tiktok" | "instagram" | "youtube" | "x";

interface Creator {
  name: string;
  joined: string;
  lastSub: string;
  platforms: Platform[];
  earned: string;
  views: string;
  match: number;
  engRate: string;
  engScore: number;
  cpm: string;
  sentiment: string;
  submissions: number;
}

const CREATORS: Creator[] = [
  { name: "xKaizen", joined: "Oct '26", lastSub: "2h ago", platforms: ["tiktok", "instagram", "youtube", "x"], earned: "$24,815.67", views: "680.4K", match: 92, engRate: "4.8%", engScore: 85, cpm: "$0.84", sentiment: "78%", submissions: 45 },
  { name: "Cryptoclipz", joined: "Nov '25", lastSub: "1d ago", platforms: ["tiktok", "instagram"], earned: "$18,090.32", views: "520.1K", match: 88, engRate: "3.9%", engScore: 79, cpm: "$0.92", sentiment: "72%", submissions: 40 },
  { name: "ViralVince", joined: "Jan '26", lastSub: "3d ago", platforms: ["tiktok", "instagram"], earned: "$25,450.67", views: "750.3K", match: 90, engRate: "4.1%", engScore: 85, cpm: "$1.05", sentiment: "75%", submissions: 50 },
  { name: "TechnoTrade", joined: "Feb '26", lastSub: "1w ago", platforms: ["tiktok"], earned: "$22,154.50", views: "610.3K", match: 85, engRate: "2.8%", engScore: 65, cpm: "$1.05", sentiment: "75%", submissions: 45 },
  { name: "GamingGrace", joined: "Mar '26", lastSub: "2w ago", platforms: ["tiktok", "instagram", "youtube"], earned: "$15,340.78", views: "450.2K", match: 90, engRate: "3.5%", engScore: 80, cpm: "$0.85", sentiment: "78%", submissions: 38 },
  { name: "BetBoss", joined: "Apr '26", lastSub: "2w ago", platforms: ["tiktok", "instagram", "youtube", "x"], earned: "$28,432.12", views: "800.5K", match: 87, engRate: "3.1%", engScore: 70, cpm: "$1.20", sentiment: "80%", submissions: 55 },
  { name: "ClipKingJr", joined: "May '26", lastSub: "5h ago", platforms: ["tiktok", "instagram"], earned: "$19,876.00", views: "530.7K", match: 92, engRate: "2.4%", engScore: 90, cpm: "$0.99", sentiment: "77%", submissions: 50 },
  { name: "NeonEdits", joined: "Jun '26", lastSub: "12h ago", platforms: ["tiktok", "instagram"], earned: "$24,760.99", views: "670.9K", match: 89, engRate: "3.0%", engScore: 82, cpm: "$1.10", sentiment: "74%", submissions: 42 },
  { name: "ReelMaster", joined: "Jul '26", lastSub: "4d ago", platforms: ["tiktok", "instagram"], earned: "$30,052.45", views: "900.4K", match: 86, engRate: "2.6%", engScore: 88, cpm: "$1.15", sentiment: "81%", submissions: 48 },
  { name: "WealthWave", joined: "Aug '26", lastSub: "6d ago", platforms: ["tiktok"], earned: "$26,485.33", views: "750.6K", match: 91, engRate: "3.3%", engScore: 77, cpm: "$1.00", sentiment: "73%", submissions: 46 },
  { name: "StableAssets", joined: "Sep '26", lastSub: "1w ago", platforms: ["instagram", "youtube"], earned: "$23,548.88", views: "620.8K", match: 88, engRate: "2.7%", engScore: 72, cpm: "$0.97", sentiment: "79%", submissions: 41 },
];

const COLUMNS = [
  { key: "creator", label: "Creator", align: "left" as const, width: "minmax(200px, 1fr)" },
  { key: "platforms", label: "Platforms", align: "right" as const, width: "132px" },
  { key: "earned", label: "Earned", align: "right" as const, width: "96px" },
  { key: "views", label: "Views", align: "right" as const, width: "80px" },
  { key: "match", label: "Match", align: "right" as const, width: "80px" },
  { key: "engRate", label: "Eng. rate", align: "right" as const, width: "88px" },
  { key: "engScore", label: "Eng. score", align: "right" as const, width: "96px" },
  { key: "cpm", label: "CPM", align: "right" as const, width: "64px" },
  { key: "sentiment", label: "Sentiment", align: "right" as const, width: "89px" },
  { key: "submissions", label: "Submissions", align: "right" as const, width: "103px" },
];

function CreatorsTable() {
  const tableRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex: hoveredRow,
    itemRects: rowRects,
    handlers,
    registerItem: registerRow,
    measureItems: measureRows,
  } = useProximityHover(tableRef, { axis: "y" });

  useEffect(() => {
    measureRows();
  }, [measureRows]);

  const hoverRect = hoveredRow !== null ? rowRects[hoveredRow] : null;

  const gridTemplate = `48px ${COLUMNS.map((c) => c.width).join(" ")} 4px`;

  return (
    <div
      ref={tableRef}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      className="scrollbar-hide relative overflow-x-auto rounded-2xl border border-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      {/* Hover indicator */}
      <AnimatePresence>
        {hoverRect && (
          <motion.div
            className="pointer-events-none absolute left-1 right-1 z-0 rounded-lg bg-accent"
            initial={{ top: hoverRect.top, height: hoverRect.height, opacity: 0 }}
            animate={{ top: hoverRect.top, height: hoverRect.height, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.15 } }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div
        className="grid border-b border-border px-1 font-[family-name:var(--font-inter)]"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div className="flex items-center justify-center py-3 pr-5 pl-3">
          <span className="w-full text-right text-xs font-medium tracking-[-0.02em] text-page-text-muted">#</span>
        </div>
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className={cn(
              "flex items-center py-3 text-xs font-medium tracking-[-0.02em] text-page-text-muted",
              col.align === "right" ? "justify-end pl-5 pr-3" : "pr-3",
            )}
          >
            {col.label}
          </div>
        ))}
        <div />
      </div>

      {/* Rows */}
      <div className="py-1">
      {CREATORS.map((creator, i) => (
        <div
          key={creator.name}
          ref={(node) => {
            registerRow(i, node);
          }}
          data-proximity-index={i}
          className="relative z-10 grid cursor-pointer px-1 font-[family-name:var(--font-inter)]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {/* # */}
          <div className="flex items-center justify-center py-3 pr-5 pl-3">
            <span className="w-full text-right text-xs font-medium tracking-[-0.02em] text-page-text-muted">
              {i + 1}
            </span>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 border-b border-border/30 py-3 pr-3">
            <div className="size-6 shrink-0 overflow-hidden rounded-full bg-accent">
              <img
                src={`https://i.pravatar.cc/48?u=${creator.name}`}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text">
                {creator.name}
              </span>
              <span className="text-xs tracking-[-0.02em] text-muted-foreground">·</span>
              <span className="text-xs tracking-[-0.02em] text-page-text-muted">
                joined {creator.joined}
              </span>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex items-center justify-end gap-1 border-b border-border/30 py-3 pr-3 pl-5">
            {creator.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>

          {/* Earned */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.earned}</span>
          </div>

          {/* Views */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.views}</span>
          </div>

          {/* Match */}
          <div className="flex items-center justify-end gap-1.5 border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-[#00B26E]">{creator.match}%</span>
            <ScoreCircle value={creator.match} color="#00B26E" />
          </div>

          {/* Eng. rate */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.engRate}</span>
          </div>

          {/* Eng. score */}
          <div className="flex items-center justify-end gap-1.5 border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.engScore}</span>
            <ScoreCircle value={creator.engScore} color="#3b82f6" />
          </div>

          {/* CPM */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.cpm}</span>
          </div>

          {/* Sentiment */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.sentiment}</span>
          </div>

          {/* Submissions */}
          <div className="flex items-center justify-end border-b border-border/30 py-3 pr-3 pl-5">
            <span className="text-xs tracking-[-0.02em] text-page-text">{creator.submissions}</span>
          </div>

          <div className="border-b border-border/30" />
        </div>
      ))}
      </div>
    </div>
  );
}

// ── Mobile Creators Table ────────────────────────────────────────────

function MobileCreatorsTable() {
  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06]">
      {/* Title row */}
      <div className="flex h-9 items-center border-b border-[rgba(37,37,37,0.06)] px-1 dark:border-foreground/[0.06]">
        <div className="flex w-8 items-center justify-center">
          <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">#</span>
        </div>
        <div className="flex flex-1 items-center py-3 pr-3">
          <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Creator</span>
        </div>
      </div>

      {/* Creator rows */}
      {CREATORS.map((creator, i) => (
        <div key={creator.name} className="flex items-center px-1">
          {/* # */}
          <div className="flex w-8 shrink-0 items-center justify-center self-stretch py-3">
            <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
              {i + 1}
            </span>
          </div>

          {/* Content */}
          <div
            className={cn(
              "flex flex-1 flex-col gap-2 py-3 pr-3",
              i < CREATORS.length - 1 && "border-b border-[rgba(37,37,37,0.03)] dark:border-foreground/[0.03]",
            )}
          >
            {/* Row 1: avatar + name + last sub */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="size-6 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={`https://i.pravatar.cc/48?u=${creator.name}`}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                    {creator.name}
                  </span>
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text/20">·</span>
                  <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                    last sub. {creator.lastSub}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: platform icons | earned */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {creator.platforms.map((p) => (
                  <PlatformBadge key={p} platform={p} />
                ))}
              </div>
              <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                {creator.earned}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

const NAV_TABS = ["Creators", "Insights"];

const FILTER_TABS = [
  { name: "All", count: 18 },
  { name: "Top", count: 5 },
  { name: "Rising", count: 6 },
  { name: "Inactive", count: 5 },
  { name: "Flagged", count: 3 },
  { name: "Blocked", count: 3 },
];

export default function CreatorsPage() {
  const [activeNavTab, setActiveNavTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(0);

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-[56px] items-center justify-between border-b border-border pr-5">
        {/* Underline tabs */}
        <div className="flex h-full items-start">
          {NAV_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveNavTab(i)}
              className={cn(
                "flex h-full cursor-pointer items-center justify-center border-b px-5 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] transition-colors",
                activeNavTab === i
                  ? "border-foreground text-page-text"
                  : "border-transparent text-page-text-subtle hover:text-page-text",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="flex h-9 items-center gap-1.5 rounded-full px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-accent">
            Understanding scores &amp; matches
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
          </button>

          <button className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-accent">
            Export
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.667V10M8 2.667L5.333 5.333M8 2.667L10.667 5.333M2.667 10.667V12C2.667 12.736 3.264 13.333 4 13.333H12C12.736 13.333 13.333 12.736 13.333 12V10.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-[21px] sm:px-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
          {/* Filter tabs */}
          <Tabs selectedIndex={selectedFilter} onSelect={setSelectedFilter} className="scrollbar-hide overflow-x-auto">
            {FILTER_TABS.map((tab, i) => (
              <TabItem
                key={tab.name}
                label={tab.name}
                count={tab.count}
                index={i}
              />
            ))}
          </Tabs>

          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card-bg px-3 md:w-[300px] md:flex-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 text-page-text-muted"
              >
                <path
                  d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
              />
            </div>

            <button className="flex size-9 items-center justify-center rounded-2xl bg-accent text-page-text transition-colors hover:bg-accent">
              <FilterIcon />
            </button>
          </div>
        </div>

        {/* Creators table */}
        <div className="mt-4">
          <div className="sm:hidden">
            <MobileCreatorsTable />
          </div>
          <div className="hidden sm:block">
            <CreatorsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
