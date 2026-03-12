"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { NewCampaignButton } from "@/components/sidebar/new-campaign-dropdown";
import { RichButton } from "@/components/rich-button";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";
import { MusicNoteIcon } from "@/components/sidebar/icons/music-note";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.33329 0.666016L11.3333 4.666L7.33329 8.66602M10.6666 4.666H0.666626" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
import { ScissorsIcon } from "@/components/sidebar/icons/scissors";
import { PersonIcon } from "@/components/sidebar/icons/person";
import { VideoLibraryIcon } from "@/components/sidebar/icons/video-library";
import { ArchiveIcon } from "@/components/sidebar/icons/archive";
import { PencilIcon } from "@/components/sidebar/icons/pencil";
import { PauseIcon, PlayIcon } from "@/components/sidebar/icons/pause";
import { UsersIcon } from "@/components/sidebar/icons/users";

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
  { label: "All Campaigns", count: 21 },
  { label: "CPM", count: 8 },
  { label: "Retainer", count: 8 },
  { label: "Per Video", count: 8 },
  { label: "Blended", count: 8 },
  { label: "Featured", count: 8 },
];

// ── Helpers ────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: "scissors" | "music" | "swords" }) {
  switch (type) {
    case "scissors":
      return <ScissorsIcon className="size-3 text-page-text" />;
    case "music":
      return <MusicNoteIcon className="size-3 text-page-text" />;
    case "swords":
      return <GamepadIcon className="size-3 text-page-text" />;
  }
}

function CategoryIcon({ type }: { type: "user" | "swords" | "music" }) {
  switch (type) {
    case "user":
      return <PersonIcon className="size-3 text-page-text" />;
    case "swords":
      return <GamepadIcon className="size-3 text-page-text" />;
    case "music":
      return <MusicNoteIcon className="size-3 text-page-text" />;
  }
}

// ── Active Campaign Card ───────────────────────────────────────────

function ActiveCampaignCard({ campaign, onTopUp }: { campaign: Campaign; onTopUp?: () => void }) {
  return (
    <div className="group relative flex flex-col sm:h-[189px] sm:flex-row cursor-pointer items-stretch sm:items-center gap-0 sm:gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06] dark:bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),var(--card-bg)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:bg-foreground/0 before:transition-colors before:duration-200 hover:before:bg-foreground/[0.03]">
      {/* Left section: thumbnail + info */}
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:gap-4 sm:self-stretch sm:pr-8">
        {/* Thumbnail */}
        <div className="relative shrink-0 sm:self-stretch p-1">
          <img
            src={campaign.thumbnail}
            alt=""
            className="h-[160px] sm:h-full w-full sm:w-[200px] lg:w-[307px] rounded-[18px] object-cover"
          />
          {/* CPM badge */}
          <div className="absolute left-4 top-4 z-[1] flex items-center justify-center gap-[1px] rounded-full bg-blue-500/40 px-2.5 py-2 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DBEAFE]">
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
            <button className="group/btn flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] py-1.5 pl-2 pr-2 transition-[padding,margin] duration-200 ease-out hover:mr-[-6px] hover:pr-3.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">
                View on Discover
              </span>
              <ArrowRightIcon className="size-3 shrink-0 text-page-text/70 transition-transform duration-200 ease-out group-hover/btn:translate-x-[3px]" />
            </button>
          </div>

          {/* Title */}
          <h3 className="truncate font-inter text-base leading-[1.3] font-semibold tracking-[-0.02em] text-page-text">
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
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2 pr-2.5 backdrop-blur-[12px]">
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
      <div className="flex shrink-0 flex-col items-end gap-4 self-stretch px-4 sm:p-4 sm:pl-8 pb-4">
        {/* Stats */}
        <div className="flex flex-1 flex-col items-end gap-4">
          {/* Stat pills */}
          <div className="flex items-start gap-1">
            <div className="flex h-6 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-foreground/[0.06] dark:bg-card-bg">
              <UsersIcon className="size-3 text-page-text" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {campaign.creators}
              </span>
            </div>
            <div className="flex h-6 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-foreground/[0.06] dark:bg-card-bg">
              <VideoLibraryIcon className="size-3 text-page-text" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {campaign.videos}
              </span>
            </div>
            <div className="flex h-6 items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5">
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
            <ArchiveIcon className="size-3" />
          </button>
          <button className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            Edit
            <PencilIcon className="size-3" />
          </button>
          <button className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.1]">
            <PauseIcon className="size-4" />
          </button>
          <RichButton size="sm" className="rounded-full px-3 font-inter text-xs tracking-[-0.02em]" onClick={onTopUp}>
            Top up
          </RichButton>
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
      className={`group relative flex flex-col sm:h-[189px] sm:flex-row cursor-pointer items-stretch sm:items-center gap-0 sm:gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.03)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:bg-foreground/0 before:transition-colors before:duration-200 hover:before:bg-foreground/[0.03] dark:border-foreground/[0.06] ${
        isCompleted
          ? "bg-white opacity-70 dark:bg-card-bg"
          : "bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] dark:bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),var(--card-bg)]"
      }`}
    >
      {/* Left: thumbnail + info */}
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:gap-4 sm:self-stretch sm:pr-8">
        {/* Thumbnail */}
        <div className="relative shrink-0 sm:self-stretch p-1">
          <img
            src={campaign.thumbnail}
            alt=""
            className="h-[160px] sm:h-full w-full sm:w-[200px] lg:w-[307px] rounded-[18px] object-cover"
          />
          <div className="absolute left-4 top-4 z-[1] flex items-center justify-center gap-[1px] rounded-full bg-blue-500/40 px-2.5 py-2 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DBEAFE]">
              {campaign.cpm}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col self-stretch py-3">
          {/* Top section: badges + title */}
          <div className="flex flex-col gap-2">
            {/* Status badges */}
            <div className="flex items-center gap-1">
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
                <button className="group/btn ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] py-1.5 pl-2 pr-2 transition-[padding,margin] duration-200 ease-out hover:mr-[-6px] hover:pr-3.5">
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">
                    View on Discover
                  </span>
                  <ArrowRightIcon className="size-3 shrink-0 text-page-text/70 transition-transform duration-200 ease-out group-hover/btn:translate-x-[3px]" />
                </button>
              )}
            </div>

            {/* Title */}
            <h3 className="truncate font-inter text-sm font-medium leading-[1.3] tracking-[-0.02em] text-page-text">
              {campaign.title}
            </h3>
          </div>

          {/* Bottom section: meta + stats */}
          <div className="mt-auto flex flex-col gap-2">
            {/* Meta row */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2 pr-2.5">
                  <UsersIcon className="size-3 text-page-text" />
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                    {campaign.creators}
                  </span>
                </div>
                <div className="flex h-6 items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5">
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
                <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2 pr-2.5 backdrop-blur-[12px]">
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
      </div>

      {/* Divider */}
      <div className="hidden sm:flex self-stretch py-4">
        <div className="w-px bg-[rgba(37,37,37,0.06)] dark:bg-foreground/[0.06]" />
      </div>

      {/* Right section */}
      <div className="flex shrink-0 flex-col items-end justify-end gap-4 self-stretch px-4 sm:p-4 sm:pl-8 pb-4">
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
          <button className="group/btn flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-[padding,margin] duration-200 ease-out hover:mr-[-6px] hover:pr-[18px]">
            View payouts
            <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-200 ease-out group-hover/btn:translate-x-[3px]" />
          </button>
          {isPaused && (
            <button className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.1]">
              <PlayIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Campaign Card Router ───────────────────────────────────────────

function CampaignCard({ campaign, onTopUp }: { campaign: Campaign; onTopUp?: () => void }) {
  if (campaign.status === "active") {
    return <ActiveCampaignCard campaign={campaign} onTopUp={onTopUp} />;
  }
  return <DetailCampaignCard campaign={campaign} />;
}

// ── Header Tabs with proximity hover ────────────────────────────────

function HeaderTabs({ selectedIndex, onSelect }: { selectedIndex: number; onSelect: (i: number) => void }) {
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
  }, [measureTabs]);

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-14 items-stretch"
    >
      {/* Selected underline */}
      {selectedRect && (
        <motion.div
          className="pointer-events-none absolute bottom-0 h-px bg-page-text"
          initial={false}
          animate={{
            left: selectedRect.left,
            width: selectedRect.width,
          }}
          transition={springs.moderate}
        />
      )}

      {/* Hover highlight */}
      <AnimatePresence>
        {hoverRect && !isHoveringSelected && (
          <motion.div
            className="pointer-events-none absolute bottom-0 h-8 rounded-lg bg-foreground/[0.04]"
            initial={{
              left: selectedRect?.left ?? hoverRect.left,
              width: selectedRect?.width ?? hoverRect.width,
              opacity: 0,
            }}
            animate={{
              left: hoverRect.left,
              width: hoverRect.width,
              opacity: 1,
            }}
            exit={
              !isMouseInside.current && selectedRect
                ? {
                    left: selectedRect.left,
                    width: selectedRect.width,
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
            style={{ bottom: 12 }}
          />
        )}
      </AnimatePresence>

      {FILTER_TABS.map((tab, i) => {
        const isSelected = selectedIndex === i;
        const isHovered = hoveredIndex === i;
        return (
          <button
            key={tab.label}
            data-proximity-index={i}
            ref={(el) => {
              registerTab(i, el);
            }}
            onClick={() => onSelect(i)}
            className={cn(
              "relative z-10 flex cursor-pointer items-center justify-center gap-2 px-5 font-inter text-sm tracking-[-0.02em] transition-colors",
              isSelected || isHovered
                ? "text-page-text"
                : "text-page-text/70",
            )}
          >
            <span className="font-medium">{tab.label}</span>
            <span className="font-normal text-page-text/50">{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── History Icon ────────────────────────────────────────────────────

function HistoryIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 3.33398V6.00065H4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.34143 10C3.1651 12.3304 5.38758 14 8.00002 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8.00002 2C5.51392 2 3.38097 3.51204 2.47063 5.66667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 5.33398V8.00065L10 10.0007" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── History Modal ───────────────────────────────────────────────────

const TRANSACTION_HISTORY = [
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "#00994D" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "#FF2525" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "#00994D" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "#FF2525" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "#00994D" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "#FF2525" },
  { date: "Feb 18", description: "Deposit via Stripe", amount: "+$1,500.00", color: "#00994D" },
  { date: "Jan 31", description: "Payout batch #1247 (12 creators)", amount: "-$834.20", color: "#FF2525" },
];

function HistoryModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal open onClose={onClose}>
      {/* Content */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 pt-5">
        {/* Header icon + text */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full bg-card-bg shadow-[0_0_0_2px_white] dark:shadow-[0_0_0_2px_var(--card-bg)]">
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: 1 }} />
            <HistoryIcon size={24} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter text-lg font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
              Transaction History
            </span>
            <span className="max-w-[300px] text-center font-inter text-sm leading-[1.5] tracking-[-0.02em] text-page-text/70">
              An overview of your past transactions; incoming and outgoing.
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 w-full overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-center border-b border-foreground/[0.06] px-1">
            <div className="flex w-[61px] items-center px-3 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Date</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center py-3 pr-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Description</span>
            </div>
            <div className="flex w-24 items-center justify-end px-3 py-3 pl-5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Transaction</span>
            </div>
          </div>

          {/* Rows */}
          {TRANSACTION_HISTORY.map((tx, i) => (
            <div key={i} className="flex items-center px-1">
              <div
                className={cn(
                  "flex w-full items-center",
                  i < TRANSACTION_HISTORY.length - 1 && "border-b border-foreground/[0.03]",
                )}
              >
                <div className="flex h-14 w-[61px] items-center px-3">
                  <span className="font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-foreground/50">
                    {tx.date}
                  </span>
                </div>
                <div className="flex h-14 min-w-0 flex-1 items-center pr-3">
                  <span className="truncate font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
                    {tx.description}
                  </span>
                </div>
                <div className="flex h-14 w-24 items-center justify-end px-3 pl-5">
                  <span
                    className="font-inter text-xs leading-none tracking-[-0.02em]"
                    style={{ color: tx.color }}
                  >
                    {tx.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex w-full shrink-0 items-center justify-end px-5 pb-5 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

// ── Top Up Campaign Modal ─────────────────────────────────────────

const TOP_UP_AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000] as const;

interface PaymentMethod {
  id: string;
  label: string;
  detail: string;
  selected: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa", label: "Visa ending in **3920", detail: "Default", selected: false },
  { id: "ach", label: "ACH Transfer", detail: "1-3 business days", selected: true },
  { id: "wire", label: "Wire Transfer", detail: "Same day", selected: false },
];

function TopUpModal({
  onClose,
  currentBalance = 14_200,
}: {
  onClose: () => void;
  currentBalance?: number;
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(5_000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("ach");

  const depositAmount = selectedAmount === "other" ? (Number.parseInt(customAmount) || 0) : selectedAmount;
  const newBalance = currentBalance + depositAmount;

  const fmt = (n: number) =>
    `$${n.toLocaleString("en-US")}`;

  return (
    <Modal open onClose={onClose} maxWidth="max-w-[520px]" showClose={false}>
      <div className="flex max-h-[90vh] flex-col">
        {/* Header bar */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-foreground/[0.06] bg-card-bg px-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            Top Up Campaign
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-5 pb-5">
          {/* Subtitle */}
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            Easily set up an agreement with a creator.
          </span>

          {/* Current Balance */}
          <div className="flex items-center justify-between rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Current Balance
            </span>
            <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">
              {fmt(currentBalance)}
            </span>
          </div>

          {/* Select amount */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Select amount
            </span>
            <div className="flex flex-col gap-2">
              {/* Row 1: $1,000 / $5,000 / $10,000 */}
              <div className="flex items-center gap-2">
                {TOP_UP_AMOUNTS.slice(0, 3).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={cn(
                      "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                      selectedAmount === amount
                        ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                        : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                    )}
                  >
                    {fmt(amount)}
                  </button>
                ))}
              </div>
              {/* Row 2: $25,000 / $50,000 / Other */}
              <div className="flex items-center gap-2">
                {TOP_UP_AMOUNTS.slice(3).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={cn(
                      "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                      selectedAmount === amount
                        ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                        : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                    )}
                  >
                    {fmt(amount)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAmount("other")}
                  className={cn(
                    "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                    selectedAmount === "other"
                      ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                      : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                  )}
                >
                  Other
                </button>
              </div>

              {/* Custom amount input */}
              {selectedAmount === "other" && (
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  className="h-10 rounded-lg border border-foreground/16 bg-card-bg px-4 font-inter text-base font-medium tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/30 focus:border-foreground/40"
                />
              )}
            </div>
          </div>

          {/* Payment method */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Payment method
            </span>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "flex h-14 cursor-pointer items-center gap-3 rounded-2xl border bg-card-bg px-3 transition-colors",
                    selectedPayment === method.id
                      ? "border-foreground"
                      : "border-foreground/16",
                  )}
                >
                  {/* Radio */}
                  <div
                    className={cn(
                      "relative flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selectedPayment === method.id
                        ? "border-foreground"
                        : "border-foreground/24 shadow-[inset_0_2px_6px_rgba(255,255,255,0.04)]",
                    )}
                  >
                    {selectedPayment === method.id && (
                      <div className="size-2.5 rounded-[3.125px] bg-foreground shadow-[0_0_4px_rgba(255,255,255,0.25)]" />
                    )}
                  </div>
                  {/* Label */}
                  <div className="flex flex-1 items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                      {method.label}
                    </span>
                  </div>
                  {/* Detail */}
                  <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                    {method.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-foreground/[0.03] px-3 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">
                Deposit amount
              </span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D]">
                +{fmt(depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">
                New balance after deposit
              </span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {fmt(newBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer — pinned */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-foreground/[0.06] bg-card-bg px-5 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-page-bg"
          >
            Deposit funds
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Page ───────────────────────────────────────────────────────────

const STATUS_FILTER_TABS = [
  { label: "All", count: 4 },
  { label: "Active", count: 2 },
  { label: "Pending budget", count: 0 },
  { label: "Ended", count: 1 },
  { label: "Archived", count: 0 },
];

const STATUS_FILTER_MAP = ["all", "active", "pending", "completed", "archived"] as const;

export default function CampaignsPage() {
  const [selectedHeaderTab, setSelectedHeaderTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const filterStatus = STATUS_FILTER_MAP[selectedFilter];
  const filtered = CAMPAIGNS.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  return (
    <div className="min-h-full bg-page-bg">
      {/* Header with underline tabs */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <HeaderTabs selectedIndex={selectedHeaderTab} onSelect={setSelectedHeaderTab} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] py-2 pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            <HistoryIcon />
            <span>History</span>
          </button>
          <NewCampaignButton />
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="px-4 pt-[21px] sm:px-5">
        <Tabs selectedIndex={selectedFilter} onSelect={setSelectedFilter} className="w-fit">
          {STATUS_FILTER_TABS.map((tab, i) => (
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
          <CampaignCard key={campaign.id} campaign={campaign} onTopUp={() => setTopUpOpen(true)} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="font-inter text-sm text-page-text-muted">
              No campaigns found
            </span>
          </div>
        )}
      </div>

      {/* History modal */}
      {historyOpen && <HistoryModal onClose={() => setHistoryOpen(false)} />}

      {/* Top Up modal */}
      {topUpOpen && <TopUpModal onClose={() => setTopUpOpen(false)} />}
    </div>
  );
}
