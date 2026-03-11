"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import Dropdown from "@/components/ui/dropdown";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter, type ActiveFilter } from "@/components/ui/dub-filter";

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

type ColumnKey = "creator" | "platforms" | "earned" | "views" | "match" | "engRate" | "engScore" | "cpm" | "sentiment" | "submissions";
type SortDir = "asc" | "desc";

function parseNumeric(val: string): number {
  const cleaned = val.replace(/[$,%]/g, "").replace(/,/g, "");
  if (cleaned.endsWith("K")) return parseFloat(cleaned) * 1000;
  if (cleaned.endsWith("M")) return parseFloat(cleaned) * 1_000_000;
  return parseFloat(cleaned) || 0;
}

function getSortValue(creator: Creator, key: ColumnKey): number | string {
  switch (key) {
    case "creator": return creator.name.toLowerCase();
    case "platforms": return creator.platforms.length;
    case "earned": return parseNumeric(creator.earned);
    case "views": return parseNumeric(creator.views);
    case "match": return creator.match;
    case "engRate": return parseNumeric(creator.engRate);
    case "engScore": return creator.engScore;
    case "cpm": return parseNumeric(creator.cpm);
    case "sentiment": return parseNumeric(creator.sentiment);
    case "submissions": return creator.submissions;
  }
}

interface Column {
  key: ColumnKey;
  label: string;
  align: "left" | "right";
  width: string;
}

const ALL_COLUMNS: Column[] = [
  { key: "creator", label: "Creator", align: "left", width: "minmax(160px, 1fr)" },
  { key: "platforms", label: "Platforms", align: "right", width: "110px" },
  { key: "earned", label: "Earned", align: "right", width: "80px" },
  { key: "views", label: "Views", align: "right", width: "68px" },
  { key: "match", label: "Match", align: "right", width: "72px" },
  { key: "engRate", label: "Eng. rate", align: "right", width: "76px" },
  { key: "engScore", label: "Eng. score", align: "right", width: "88px" },
  { key: "cpm", label: "CPM", align: "right", width: "56px" },
  { key: "sentiment", label: "Sentiment", align: "right", width: "80px" },
  { key: "submissions", label: "Submissions", align: "right", width: "92px" },
];

const DEFAULT_COLUMN_ORDER: ColumnKey[] = ALL_COLUMNS.map((c) => c.key);
const COLUMN_MAP = Object.fromEntries(ALL_COLUMNS.map((c) => [c.key, c])) as Record<ColumnKey, Column>;

function CellContent({ colKey, creator }: { colKey: ColumnKey; creator: Creator }) {
  switch (colKey) {
    case "creator":
      return (
        <div className="flex min-w-0 items-center gap-2">
          <div className="size-6 shrink-0 overflow-hidden rounded-full bg-accent">
            <img src={`https://i.pravatar.cc/48?u=${creator.name}`} alt="" className="size-full object-cover" />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-medium tracking-[-0.02em] text-page-text">{creator.name}</span>
            <span className="shrink-0 text-xs tracking-[-0.02em] text-muted-foreground">·</span>
            <span className="shrink-0 whitespace-nowrap text-xs tracking-[-0.02em] text-page-text-muted">joined {creator.joined}</span>
          </div>
        </div>
      );
    case "platforms":
      return (
        <div className="flex items-center gap-1 overflow-hidden">
          {creator.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
        </div>
      );
    case "earned":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.earned}</span>;
    case "views":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.views}</span>;
    case "match":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-xs tracking-[-0.02em] text-[#00B26E]">{creator.match}%</span>
          <ScoreCircle value={creator.match} color="#00B26E" />
        </div>
      );
    case "engRate":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.engRate}</span>;
    case "engScore":
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-xs tracking-[-0.02em] text-page-text">{creator.engScore}</span>
          <ScoreCircle value={creator.engScore} color="#3b82f6" />
        </div>
      );
    case "cpm":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.cpm}</span>;
    case "sentiment":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.sentiment}</span>;
    case "submissions":
      return <span className="text-xs tracking-[-0.02em] text-page-text">{creator.submissions}</span>;
  }
}

function CreatorsTable({
  columns,
  sortKey,
  sortDir,
  onSort,
}: {
  columns: Column[];
  sortKey: ColumnKey | null;
  sortDir: SortDir;
  onSort: (key: ColumnKey) => void;
}) {
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
  }, [measureRows, columns]);

  const hoverRect = hoveredRow !== null ? rowRects[hoveredRow] : null;

  const sortedCreators = useMemo(() => {
    if (!sortKey) return CREATORS;
    return [...CREATORS].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [sortKey, sortDir]);

  const gridTemplate = `40px ${columns.map((c) => c.width).join(" ")} 4px`;

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
        <div className="flex items-center justify-center py-3 pr-3 pl-2">
          <span className="w-full text-right text-xs font-medium tracking-[-0.02em] text-page-text-muted">#</span>
        </div>
        {columns.map((col) => (
          <button
            key={col.key}
            type="button"
            onClick={() => onSort(col.key)}
            className={cn(
              "flex cursor-pointer items-center gap-1 py-3 text-xs font-medium tracking-[-0.02em] transition-colors",
              col.align === "right" ? "justify-end pl-3 pr-3" : "pr-3",
              sortKey === col.key ? "text-page-text" : "text-page-text-muted hover:text-page-text",
            )}
          >
            {col.label}
            {sortKey === col.key && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                <path
                  d={sortDir === "asc" ? "M2.5 6.5L5 3.5L7.5 6.5" : "M2.5 3.5L5 6.5L7.5 3.5"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ))}
        <div />
      </div>

      {/* Rows */}
      <div className="py-1">
      {sortedCreators.map((creator, i) => (
        <div
          key={creator.name}
          ref={(node) => { registerRow(i, node); }}
          data-proximity-index={i}
          className="relative z-10 grid cursor-pointer px-1 font-[family-name:var(--font-inter)]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="flex items-center justify-center py-3 pr-3 pl-2">
            <span className="w-full text-right text-xs font-medium tracking-[-0.02em] text-page-text-muted">{i + 1}</span>
          </div>
          {columns.map((col) => (
            <div
              key={col.key}
              className={cn(
                "flex min-w-0 items-center border-b border-border/30 py-3",
                col.align === "right" ? "justify-end pl-3 pr-3" : "pr-3",
              )}
            >
              <CellContent colKey={col.key} creator={creator} />
            </div>
          ))}
          <div className="border-b border-border/30" />
        </div>
      ))}
      </div>
    </div>
  );
}

// ── Column Settings Dropdown ─────────────────────────────────────────

const COLUMNS_DROPDOWN_EASING = [0.16, 1, 0.3, 1] as const;

function ColumnsDropdown({
  columnOrder,
  hiddenColumns,
  onToggleColumn,
  onReorder,
  onClose,
}: {
  columnOrder: ColumnKey[];
  hiddenColumns: Set<ColumnKey>;
  onToggleColumn: (key: ColumnKey) => void;
  onReorder: (from: number, to: number) => void;
  onClose: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dragItem = useRef<number | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <motion.div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-1 w-[220px] overflow-hidden rounded-xl border border-border bg-card-bg p-1 shadow-lg"
      initial={{ opacity: 0, y: -2, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -2, scale: 0.98 }}
      transition={{ duration: 0.2, ease: COLUMNS_DROPDOWN_EASING }}
    >
      <div className="px-2.5 py-2">
        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Columns</span>
      </div>
      <Dropdown>
        {columnOrder.map((key, idx) => {
          const col = COLUMN_MAP[key];
          const isCreator = key === "creator";
          const isHidden = hiddenColumns.has(key);
          return (
            <div
              key={key}
              data-proximity-index={idx}
              draggable={!isCreator}
              onDragStart={() => { dragItem.current = idx; }}
              onDragEnter={(e) => {
                e.preventDefault();
                if (dragItem.current !== null && dragItem.current !== idx) {
                  onReorder(dragItem.current, idx);
                  dragItem.current = idx;
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={() => { dragItem.current = null; }}
              className={cn(
                "relative z-10 flex items-center gap-2 rounded-lg px-2.5 py-2",
                !isCreator && "cursor-grab active:cursor-grabbing",
                isCreator && "opacity-50",
              )}
            >
              {/* Drag handle */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={cn("shrink-0 text-page-text-muted", isCreator && "invisible")}>
                <circle cx="4" cy="3" r="1" fill="currentColor" />
                <circle cx="8" cy="3" r="1" fill="currentColor" />
                <circle cx="4" cy="6" r="1" fill="currentColor" />
                <circle cx="8" cy="6" r="1" fill="currentColor" />
                <circle cx="4" cy="9" r="1" fill="currentColor" />
                <circle cx="8" cy="9" r="1" fill="currentColor" />
              </svg>
              <span className="flex-1 font-inter text-sm tracking-[-0.02em] text-page-text">{col.label}</span>
              {/* Checkmark toggle */}
              <button
                type="button"
                disabled={isCreator}
                onClick={() => onToggleColumn(key)}
                className="flex size-5 shrink-0 items-center justify-center"
              >
                {!isHidden && <Check className="size-4 text-page-text" strokeWidth={2.5} />}
              </button>
            </div>
          );
        })}
      </Dropdown>
    </motion.div>
  );
}

// ── Filter / Sort Dropdown ───────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M4.5 2L8 6L4.5 10" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M2.5 6.5L5 9L9.5 3" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" />
    </svg>
  );
}

// Platform icons
function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 1.5H9.5V10.5C9.5 11.6046 8.60457 12.5 7.5 12.5C6.39543 12.5 5.5 11.6046 5.5 10.5C5.5 9.39543 6.39543 8.5 7.5 8.5V6.5C5.29086 6.5 3.5 8.29086 3.5 10.5C3.5 12.7091 5.29086 14.5 7.5 14.5C9.70914 14.5 11.5 12.7091 11.5 10.5V5.5C12.3284 6.16519 13.3676 6.5 14.5 6.5V4.5C12.8431 4.5 11.5 3.15685 11.5 1.5Z" fill="currentColor" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <circle cx="8" cy="8" r="2.75" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.3 4.5C14.1 3.8 13.6 3.3 12.9 3.1C11.9 2.8 8 2.8 8 2.8C8 2.8 4.1 2.8 3.1 3.1C2.4 3.3 1.9 3.8 1.7 4.5C1.4 5.5 1.4 8 1.4 8C1.4 8 1.4 10.5 1.7 11.5C1.9 12.2 2.4 12.7 3.1 12.9C4.1 13.2 8 13.2 8 13.2C8 13.2 11.9 13.2 12.9 12.9C13.6 12.7 14.1 12.2 14.3 11.5C14.6 10.5 14.6 8 14.6 8C14.6 8 14.6 5.5 14.3 4.5ZM6.6 10.2V5.8L10.4 8L6.6 10.2Z" fill="currentColor" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 8C14 4.7 11.3 2 8 2C4.7 2 2 4.7 2 8C2 11 4.1 13.5 6.9 14V9.9H5.3V8H6.9V6.6C6.9 5 7.9 4.1 9.3 4.1C10 4.1 10.7 4.2 10.7 4.2V5.8H9.9C9.1 5.8 8.9 6.3 8.9 6.8V8H10.6L10.3 9.9H8.9V14C11.7 13.5 14 11 14 8Z" fill="currentColor" />
    </svg>
  );
}

const FILTER_SUB_OPTIONS: Record<string, { id: string; label: string; icon?: React.FC }[]> = {
  platform: [
    { id: "all", label: "All" },
    { id: "tiktok", label: "TikTok", icon: TikTokIcon },
    { id: "instagram", label: "Instagram", icon: InstagramIcon },
    { id: "youtube", label: "YouTube", icon: YouTubeIcon },
    { id: "facebook", label: "Facebook", icon: FacebookIcon },
  ],
  category: [
    { id: "all", label: "All" },
    { id: "fashion", label: "Fashion" },
    { id: "beauty", label: "Beauty" },
    { id: "tech", label: "Technology" },
    { id: "food", label: "Food & Drink" },
    { id: "fitness", label: "Fitness" },
  ],
  payment: [
    { id: "all", label: "All" },
    { id: "cpa", label: "CPA" },
    { id: "flat", label: "Flat rate" },
    { id: "hybrid", label: "Hybrid" },
  ],
};

const CREATOR_FILTERS: Filter[] = [
  {
    key: "sort",
    icon: <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M0.75 0.75H12.75M4.75 10.0833H8.75M2.75 5.41667H10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    label: "Sort by",
    singleSelect: true,
    separatorAfter: true,
    options: [
      { value: "date", label: "Date Applied" },
      { value: "payout", label: "Payout (high to low)" },
      { value: "followers", label: "Follower requirement" },
    ],
  },
  {
    key: "platform",
    icon: null,
    label: "Platform",
    singleSelect: true,
    options: FILTER_SUB_OPTIONS.platform
      .filter((s) => s.id !== "all")
      .map((s) => ({
        value: s.id,
        label: s.label,
        icon: s.icon ? <s.icon /> : undefined,
      })),
  },
  {
    key: "category",
    icon: null,
    label: "Category",
    singleSelect: true,
    options: FILTER_SUB_OPTIONS.category
      .filter((s) => s.id !== "all")
      .map((s) => ({ value: s.id, label: s.label })),
  },
  {
    key: "payment",
    icon: null,
    label: "Payment model",
    singleSelect: true,
    options: FILTER_SUB_OPTIONS.payment
      .filter((s) => s.id !== "all")
      .map((s) => ({ value: s.id, label: s.label })),
  },
];

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
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(DEFAULT_COLUMN_ORDER);
  const [hiddenColumns, setHiddenColumns] = useState<Set<ColumnKey>>(new Set());
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortKey, setSortKey] = useState<ColumnKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dubActiveFilters, setDubActiveFilters] = useState<ActiveFilter[]>([]);

  const handleFilterSelect = useCallback((key: string, value: string | string[]) => {
    const v = Array.isArray(value) ? value[0] : value;
    setDubActiveFilters((prev) => {
      const existing = prev.find((f) => f.key === key);
      if (existing) return prev.map((f) => (f.key === key ? { ...f, values: [v] } : f));
      return [...prev, { key, values: [v] }];
    });
  }, []);

  const handleFilterRemove = useCallback((key: string) => {
    setDubActiveFilters((prev) => prev.filter((f) => f.key !== key));
  }, []);

  const handleSort = useCallback((key: ColumnKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }, [sortKey]);

  const toggleColumn = useCallback((key: ColumnKey) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const reorderColumns = useCallback((from: number, to: number) => {
    setColumnOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const visibleColumns = useMemo(
    () => columnOrder.filter((k) => !hiddenColumns.has(k)).map((k) => COLUMN_MAP[k]),
    [columnOrder, hiddenColumns],
  );

  return (
    <div>
      {/* Top nav */}
      <div className="sticky top-0 z-10 flex h-[56px] items-center justify-between border-b border-border bg-page-bg pr-5">
        {/* Underline tabs */}
        <Tabs selectedIndex={activeNavTab} onSelect={setActiveNavTab} variant="underline" className="h-full">
          {NAV_TABS.map((tab, i) => (
            <TabItem key={tab} label={tab} index={i} />
          ))}
        </Tabs>

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

            {(() => {
              const activeCount = dubActiveFilters.filter((f) => !(f.key === "sort" && f.values[0] === "date")).length;
              const hasActive = activeCount > 0;
              return (
                <FilterSelect
                  filters={CREATOR_FILTERS}
                  activeFilters={dubActiveFilters}
                  onSelect={handleFilterSelect}
                  onRemove={handleFilterRemove}
                  searchPlaceholder="Sort & filter..."
                >
                  <button
                    onClick={() => setColumnsOpen(false)}
                    className={cn(
                      "flex cursor-pointer items-center gap-0.5 transition-colors",
                      hasActive
                        ? "h-9 rounded-xl bg-foreground/[0.06] py-0.5 pl-0.5 pr-3 text-page-text"
                        : "size-9 justify-center rounded-2xl bg-accent text-page-text hover:bg-accent",
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center",
                      hasActive ? "size-8 rounded-[10px]" : "",
                    )}>
                      <FilterIcon />
                    </span>
                    {hasActive && (
                      <span className="flex size-[14px] items-center justify-center rounded-full bg-[#FF2525]">
                        <span className="font-[family-name:var(--font-inter)] text-[10px] font-semibold leading-none tracking-[-0.02em] text-white">
                          {activeCount}
                        </span>
                      </span>
                    )}
                  </button>
                </FilterSelect>
              );
            })()}

            {/* Columns toggle */}
            <div className="relative">
              <button
                onClick={() => setColumnsOpen((v) => !v)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-2xl transition-colors",
                  columnsOpen ? "bg-foreground text-page-bg" : "bg-accent text-page-text hover:bg-accent",
                )}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none" />
                  <rect x="9" y="1" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" fill="none" />
                </svg>
              </button>
              <AnimatePresence>
                {columnsOpen && (
                  <ColumnsDropdown
                    columnOrder={columnOrder}
                    hiddenColumns={hiddenColumns}
                    onToggleColumn={toggleColumn}
                    onReorder={reorderColumns}
                    onClose={() => setColumnsOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        {(() => {
          const chips = dubActiveFilters.filter((f) => !(f.key === "sort" && f.values[0] === "date"));
          if (chips.length === 0) return null;
          return (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {chips.map((af) => {
                const filter = CREATOR_FILTERS.find((f) => f.key === af.key);
                const optionLabel = filter?.options?.find((o) => o.value === af.values[0])?.label ?? af.values[0];
                const chipLabel = af.key === "sort" ? optionLabel : `${filter?.label ?? af.key}: ${optionLabel}`;
                return (
                  <button
                    key={af.key}
                    onClick={() => handleFilterRemove(af.key)}
                    className="flex h-6 items-center gap-1 rounded-lg bg-foreground/[0.06] px-2 transition-colors hover:bg-foreground/[0.1]"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground/40">
                      <path d="M1.5 3H10.5M3 6H9M4.5 9H7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-foreground/70">
                      {chipLabel}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground/30">
                      <path d="M3.5 3.5L8.5 8.5M8.5 3.5L3.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* Creators table */}
        <div className="mt-4 min-w-0">
          <div className="md:hidden">
            <MobileCreatorsTable />
          </div>
          <div className="hidden md:block">
            <CreatorsTable columns={visibleColumns} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </div>
        </div>
      </div>
    </div>
  );
}
