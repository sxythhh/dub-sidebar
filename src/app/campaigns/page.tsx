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
import { NewCampaignButton } from "@/components/sidebar/new-campaign-dropdown";
import {
  Scissors,
  ArrowRight,
  Users,
  Video,
  Archive,
  Pencil,
  Pause,
  Music,
  Swords,
  User,
} from "lucide-react";

// ── Subtle Tab primitives (same as creators) ─────────────────────

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
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative flex w-fit items-center gap-0.5 rounded-2xl bg-accent p-0.5 select-none",
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
    count?: number;
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
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
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
      {count !== undefined && (
        <span className="text-sm font-normal text-page-text-muted">
          {count}
        </span>
      )}
    </button>
  );
});
TabItem.displayName = "TabItem";

// ── Types ──────────────────────────────────────────────────────────

type CampaignStatus = "active" | "paused" | "completed" | "pending" | "archived";

interface Campaign {
  id: number;
  title: string;
  thumbnail: string;
  cpm: string;
  status: CampaignStatus;
  type: string;
  typeIcon: "scissors" | "music" | "swords";
  platforms: ("tiktok" | "instagram")[];
  category: string;
  categoryIcon: "user" | "swords" | "music";
  creators: string;
  videos: number;
  cpmRate: string;
  cpmUnit: string;
  joinedDate: string;
  progress?: number;
  earned?: string;
  pending?: string;
  videosSubmitted?: string;
  views?: string;
  brandName?: string;
  brandAvatar?: string;
  brandVerified?: boolean;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    cpm: "CPM",
    status: "active",
    type: "Clipping",
    typeIcon: "scissors",
    platforms: ["tiktok", "instagram"],
    category: "Personal brand",
    categoryIcon: "user",
    creators: "121K",
    videos: 31,
    cpmRate: "$0.50",
    cpmUnit: "1K",
    joinedDate: "Tue 3 Mar, 2026",
    progress: 45,
  },
  {
    id: 2,
    title: "Call of Duty BO7 Official Clipping Campaign",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    cpm: "CPM",
    status: "active",
    type: "Clipping",
    typeIcon: "scissors",
    platforms: ["tiktok", "instagram"],
    category: "Gaming",
    categoryIcon: "swords",
    creators: "121K",
    videos: 31,
    cpmRate: "$0.50",
    cpmUnit: "1K",
    joinedDate: "Tue 3 Mar, 2026",
    progress: 45,
  },
  {
    id: 3,
    title: "Mumford & Sons | Prizefighter Clipping",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    cpm: "CPM",
    status: "paused",
    type: "Clipping",
    typeIcon: "scissors",
    platforms: ["tiktok", "instagram"],
    category: "Music",
    categoryIcon: "music",
    creators: "725",
    videos: 0,
    cpmRate: "$1",
    cpmUnit: "1K",
    joinedDate: "Thu 12 Feb, 2026",
    earned: "$1,240",
    pending: "$58",
    videosSubmitted: "5/8",
    views: "587K",
  },
  {
    id: 4,
    title: "PolyMarket UGC Reposting Campaign",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    cpm: "CPM",
    status: "completed",
    type: "Clipping",
    typeIcon: "scissors",
    platforms: ["tiktok", "instagram"],
    category: "Personal brand",
    categoryIcon: "user",
    creators: "95",
    videos: 0,
    cpmRate: "$0.50",
    cpmUnit: "1K",
    joinedDate: "Mon 23 Feb, 2026",
    brandName: "Polymarket Official Clipping",
    brandAvatar: "https://i.pravatar.cc/20?img=60",
    brandVerified: true,
    earned: "$1,240",
    pending: "$0",
    videosSubmitted: "12/16",
    views: "587K",
  },
];

const FILTER_TABS = [
  { label: "All", count: 4 },
  { label: "Active", count: 2 },
  { label: "Pending budget", count: 0 },
  { label: "Ended", count: 1 },
  { label: "Archived", count: 0 },
];

// ── Helpers ────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: "scissors" | "music" | "swords" }) {
  switch (type) {
    case "scissors":
      return <Scissors className="size-3 text-page-text" strokeWidth={2} />;
    case "music":
      return <Music className="size-3 text-page-text" strokeWidth={2} />;
    case "swords":
      return <Swords className="size-3 text-page-text" strokeWidth={2} />;
  }
}

function CategoryIcon({ type }: { type: "user" | "swords" | "music" }) {
  switch (type) {
    case "user":
      return <User className="size-3 text-page-text" strokeWidth={2} />;
    case "swords":
      return <Swords className="size-3 text-page-text" strokeWidth={2} />;
    case "music":
      return <Music className="size-3 text-page-text" strokeWidth={2} />;
  }
}

// ── Active Campaign Card ───────────────────────────────────────────

function ActiveCampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06] dark:bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),var(--card-bg)]">
      {/* Left section: thumbnail + info */}
      <div className="flex min-w-0 flex-1 items-center gap-4 pr-8">
        {/* Thumbnail */}
        <div className="relative shrink-0 self-stretch p-1">
          <img
            src={campaign.thumbnail}
            alt=""
            className="h-full w-[307px] rounded-2xl object-cover"
          />
          {/* CPM badge */}
          <div className="absolute left-4 top-4 flex items-center rounded-full bg-blue-500/40 px-2.5 py-1.5 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-100">
              {campaign.cpm}
            </span>
          </div>
        </div>

        {/* Campaign info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch py-4">
          {/* Status + discover badges */}
          <div className="flex items-start gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-[rgba(0,178,89,0.1)] px-2 py-1.5">
              <div className="size-1.5 rounded-full bg-[#00B259]" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00B259]">
                Active
              </span>
            </div>
            <button className="flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">
                View on Discover
              </span>
              <ArrowRight className="size-3 text-page-text/70" strokeWidth={2} />
            </button>
          </div>

          {/* Title */}
          <h3 className="truncate font-inter text-base font-semibold tracking-[-0.02em] text-page-text">
            {campaign.title}
          </h3>

          {/* Meta row: type · platforms · category */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <TypeIcon type={campaign.typeIcon} />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {campaign.type}
              </span>
            </div>
            <span className="font-inter text-xs text-foreground/20">·</span>
            <div className="flex items-center gap-1">
              {campaign.platforms.map((p) => (
                <div
                  key={p}
                  className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]"
                >
                  <PlatformIcon platform={p} size={12} />
                </div>
              ))}
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] py-1.5 pl-2 pr-2.5 backdrop-blur-[12px]">
                <CategoryIcon type={campaign.categoryIcon} />
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                  {campaign.category}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00B259]">
              {campaign.progress}%
            </span>
            <div className="relative h-1 w-full rounded-full bg-foreground/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#00B259]"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right section: stats + actions */}
      <div className="flex shrink-0 flex-col items-end gap-4 self-stretch p-4 pl-8">
        {/* Stats */}
        <div className="flex flex-1 flex-col items-end gap-4">
          {/* Stat pills */}
          <div className="flex items-start gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 py-1.5 dark:border-foreground/[0.06] dark:bg-card-bg">
              <Users className="size-3 text-page-text" strokeWidth={2} />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {campaign.creators}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 py-1.5 dark:border-foreground/[0.06] dark:bg-card-bg">
              <Video className="size-3 text-page-text" strokeWidth={2} />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {campaign.videos}
              </span>
            </div>
            <div className="flex items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5 py-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-500">
                {campaign.cpmRate}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">/</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">
                {campaign.cpmUnit}
              </span>
            </div>
          </div>

          {/* Joined date */}
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
            Joined on {campaign.joinedDate}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            Archive
            <Archive className="size-3" strokeWidth={2} />
          </button>
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            Edit
            <Pencil className="size-3" strokeWidth={2} />
          </button>
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            Pause
            <Pause className="size-3" strokeWidth={2} />
          </button>
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground px-3 font-inter text-xs font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90">
            Top up
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Paused / Completed Campaign Card ───────────────────────────────

function DetailCampaignCard({ campaign }: { campaign: Campaign }) {
  const isPaused = campaign.status === "paused";
  const isCompleted = campaign.status === "completed";

  return (
    <div
      className={`flex items-center gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06] ${
        isCompleted
          ? "bg-white opacity-70 dark:bg-card-bg"
          : "bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] dark:bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),var(--card-bg)]"
      }`}
    >
      {/* Left: thumbnail + info */}
      <div className="flex min-w-0 flex-1 items-center gap-4 pr-8">
        {/* Thumbnail */}
        <div className="relative shrink-0 self-stretch p-1">
          <img
            src={campaign.thumbnail}
            alt=""
            className="h-full w-[307px] rounded-2xl object-cover"
          />
          <div className="absolute left-4 top-4 flex items-center rounded-full bg-blue-500/40 px-2.5 py-1.5 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-100">
              {campaign.cpm}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 self-stretch py-4">
          {/* Status badges */}
          <div className="flex items-start gap-1">
            {isPaused && (
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-1.5">
                <div className="size-1.5 rounded-full bg-page-text/70" />
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">
                  Paused
                </span>
              </div>
            )}
            {isCompleted && campaign.brandAvatar && (
              <div className="flex items-center gap-1.5">
                <img src={campaign.brandAvatar} alt="" className="size-5 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.4)]" />
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                  {campaign.brandName}
                </span>
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-1.5">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">
                  View on Discover
                </span>
                <ArrowRight className="size-3 text-page-text/70" strokeWidth={2} />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            {campaign.title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] py-1.5 pl-2 pr-2.5">
                <Users className="size-3 text-page-text" strokeWidth={2} />
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                  {campaign.creators}
                </span>
              </div>
              <div className="flex items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5 py-1.5">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-500">
                  {campaign.cpmRate}
                </span>
                <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">/</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">
                  {campaign.cpmUnit}
                </span>
              </div>
            </div>
            <span className="font-inter text-xs text-foreground/20">·</span>
            <div className="flex items-center gap-1">
              {campaign.platforms.map((p) => (
                <div
                  key={p}
                  className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]"
                >
                  <PlatformIcon platform={p} size={12} />
                </div>
              ))}
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] py-1.5 pl-2 pr-2.5 backdrop-blur-[12px]">
                <CategoryIcon type={campaign.categoryIcon} />
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                  {campaign.category}
                </span>
              </div>
            </div>
          </div>

          {/* Stat cards row */}
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-foreground/[0.06] dark:bg-card-bg">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                {campaign.earned}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
                Earned
              </span>
            </div>
            <div className={`flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-[rgba(37,37,37,0.06)] p-3 dark:border-foreground/[0.06] ${
              campaign.pending && campaign.pending !== "$0"
                ? "bg-[rgba(255,144,37,0.1)]"
                : "bg-white dark:bg-card-bg"
            }`}>
              <span className={`font-inter text-sm font-medium tracking-[-0.02em] ${
                campaign.pending && campaign.pending !== "$0"
                  ? "text-[#FF9025]"
                  : "text-page-text/50"
              }`}>
                {campaign.pending}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
                Pending
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-foreground/[0.06] dark:bg-card-bg">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                {campaign.videosSubmitted}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
                Videos submitted
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-foreground/[0.06] dark:bg-card-bg">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                {campaign.views}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
                Views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex self-stretch py-4">
        <div className="w-px bg-[rgba(37,37,37,0.06)] dark:bg-foreground/[0.06]" />
      </div>

      {/* Right section */}
      <div className="flex shrink-0 flex-col items-end gap-4 self-stretch p-4 pl-8">
        <div className="flex flex-1 flex-col items-end gap-2">
          {isCompleted && (
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-1.5 dark:border-foreground/[0.06] dark:bg-card-bg">
              <div className="size-1.5 rounded-full bg-page-text/50" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/50">
                Completed
              </span>
            </div>
          )}
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
            Joined on {campaign.joinedDate}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            View payouts
            <ArrowRight className="size-3" strokeWidth={2} />
          </button>
          {isPaused && (
            <button className="flex h-8 cursor-pointer items-center rounded-full bg-foreground px-3 font-inter text-xs font-medium tracking-[-0.02em] text-white opacity-30">
              Submit content
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Campaign Card Router ───────────────────────────────────────────

function CampaignCard({ campaign }: { campaign: Campaign }) {
  if (campaign.status === "active") {
    return <ActiveCampaignCard campaign={campaign} />;
  }
  return <DetailCampaignCard campaign={campaign} />;
}

// ── Page ───────────────────────────────────────────────────────────

const FILTER_STATUS_MAP = ["all", "active", "pending", "completed", "archived"] as const;

export default function CampaignsPage() {
  const [selectedFilter, setSelectedFilter] = useState(0);

  const filterStatus = FILTER_STATUS_MAP[selectedFilter];
  const filtered = CAMPAIGNS.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  return (
    <div className="min-h-full bg-page-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Campaigns
        </span>
        <NewCampaignButton />
      </div>

      {/* Filter tabs */}
      <div className="px-4 pt-[21px] sm:px-5">
        <Tabs selectedIndex={selectedFilter} onSelect={setSelectedFilter}>
          {FILTER_TABS.map((tab, i) => (
            <TabItem
              key={tab.label}
              label={tab.label}
              count={tab.count}
              index={i}
            />
          ))}
        </Tabs>
      </div>

      {/* Campaign list */}
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="font-inter text-sm text-page-text-muted">
              No campaigns found
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
