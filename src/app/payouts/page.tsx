"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabItem } from "@/components/ui/tabs";

const TIME_FILTERS = ["This week", "This month", "All Time"];

const STATUS_FILTERS = [
  { label: "All", count: 9 },
  { label: "Processing", count: 4 },
  { label: "In Review", count: 3 },
  { label: "Suspicious", count: 1 },
];

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
  platforms: ("tiktok" | "instagram" | "youtube" | "x")[];
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
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="#FF9025"/>
      </svg>
    ),
  },
  paid: {
    label: "Paid",
    color: "#00B259",
    bg: "rgba(0, 178, 89, 0.1)",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM6.88698 4.06663C7.06184 3.85291 7.03034 3.5379 6.81662 3.36304C6.6029 3.18817 6.28789 3.21967 6.11302 3.4334L4.21288 5.75579L3.60355 5.14646C3.40829 4.9512 3.09171 4.9512 2.89645 5.14646C2.70118 5.34172 2.70118 5.65831 2.89645 5.85357L3.89645 6.85357C3.99634 6.95346 4.13382 7.00643 4.27491 6.9994C4.416 6.99236 4.54752 6.92597 4.63698 6.81663L6.88698 4.06663Z" fill="#00B259"/>
      </svg>
    ),
  },
  blocked: {
    label: "Blocked",
    color: "#FF2525",
    bg: "rgba(255, 37, 37, 0.1)",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM3.85355 3.14645C3.65829 2.95118 3.34171 2.95118 3.14645 3.14645C2.95118 3.34171 2.95118 3.65829 3.14645 3.85355L4.29289 5L3.14645 6.14645C2.95118 6.34171 2.95118 6.65829 3.14645 6.85355C3.34171 7.04882 3.65829 7.04882 3.85355 6.85355L5 5.70711L6.14645 6.85355C6.34171 7.04882 6.65829 7.04882 6.85355 6.85355C7.04882 6.65829 7.04882 6.34171 6.85355 6.14645L5.70711 5L6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L5 4.29289L3.85355 3.14645Z" fill="#FF2525"/>
      </svg>
    ),
  },
  upcoming: {
    label: "Upcoming",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="#3B82F6"/>
      </svg>
    ),
  },
};

const PAYOUT_ROWS: PayoutRow[] = [
  { id: "1", name: "xKaizen", platforms: ["tiktok", "instagram", "youtube", "x"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "2", name: "Cryptoclipz", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "3", name: "ViralVince", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "4", name: "TechnoTrade", platforms: ["tiktok"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "blocked", flagged: true },
  { id: "5", name: "GamingGrace", platforms: ["tiktok", "instagram", "youtube"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "upcoming" },
  { id: "6", name: "BetBoss", platforms: ["tiktok", "instagram", "youtube", "x"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "7", name: "ClipKingJr", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
  { id: "8", name: "NeonEdits", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "paid" },
  { id: "9", name: "ReelMaster", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", views: "337.4K", estPayout: "$139.75", net: "$129.32", status: "pending" },
];

const AVATAR_COLORS = [
  "#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EF4444", "#14B8A6", "#F97316",
];

type PayoutSortKey = "creator" | "platforms" | "campaign" | "views" | "estPayout" | "net" | "status";
type SortDir = "asc" | "desc";

const PAYOUT_STATUS_ORDER: Record<PayoutStatus, number> = { paid: 0, pending: 1, upcoming: 2, blocked: 3 };

function parsePayoutNumeric(val: string): number {
  const cleaned = val.replace(/[$,%]/g, "").replace(/,/g, "");
  if (cleaned.endsWith("K")) return parseFloat(cleaned) * 1000;
  if (cleaned.endsWith("M")) return parseFloat(cleaned) * 1_000_000;
  return parseFloat(cleaned) || 0;
}

function getPayoutSortValue(row: PayoutRow, key: PayoutSortKey): number | string {
  switch (key) {
    case "creator": return row.name.toLowerCase();
    case "platforms": return row.platforms.length;
    case "campaign": return row.campaign.toLowerCase();
    case "views": return parsePayoutNumeric(row.views);
    case "estPayout": return parsePayoutNumeric(row.estPayout);
    case "net": return parsePayoutNumeric(row.net);
    case "status": return PAYOUT_STATUS_ORDER[row.status];
  }
}

const PAYOUT_COLUMNS: { label: string; sortKey: PayoutSortKey | null }[] = [
  { label: "Creator", sortKey: "creator" },
  { label: "Platforms", sortKey: "platforms" },
  { label: "Campaign", sortKey: "campaign" },
  { label: "Views", sortKey: "views" },
  { label: "Est. payout", sortKey: "estPayout" },
  { label: "Net", sortKey: "net" },
  { label: "Status", sortKey: "status" },
];

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-page-text-subtle">
      <PlatformIcon platform={platform} size={12} />
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

/* ── Payout Detail Dialog ──────────────────────────────────────────── */

const METRIC_PILLS = [
  { label: "Views", value: "171.9K", color: "#4D81EE", bg: "rgba(77, 129, 238, 0.1)" },
  { label: "Likes", value: "7.6K", color: "#DA5597", bg: "rgba(218, 85, 151, 0.1)" },
  { label: "Comments", value: "312", color: "#E9A23B", bg: "rgba(233, 162, 59, 0.1)" },
  { label: "Shares", value: "1.1K", color: "#00B259", bg: "rgba(0, 178, 89, 0.1)" },
];

const PAYOUT_HISTORY = [
  { date: "Feb 18", title: "CPM payout - 171.9K views", amount: "$139.75", status: "pending" as const },
  { date: "Jan 31", title: "CPM payout - 171.9K views", amount: "$69.16", status: "paid" as const },
];

type PayoutDetailTab = "review" | "history";

const CLAWBACK_REASONS = [
  "Bot/fake views",
  "Content violation",
  "Deleted video",
  "Below threshold",
  "Other",
] as const;

function ClawbackView({
  row,
  onClose,
  onBack,
}: {
  row: PayoutRow;
  onClose: () => void;
  onBack: () => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>("Deleted video");
  const [note, setNote] = useState("");

  return (
    <>
      {/* Header bar */}
      <div className="relative flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Clawback
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
      <div className="flex flex-col items-center gap-4 px-5 pb-5 pt-5">
        {/* Subtitle */}
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Review and confirm clawback for selected payouts
        </span>

        {/* Selected payouts card */}
        <div className="flex w-full flex-col gap-3 rounded-2xl bg-foreground/[0.02] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-foreground/[0.04]">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Selected Payouts
            </span>
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
              {row.estPayout}
            </span>
          </div>

          {/* Payout rows */}
          <div className="flex flex-col gap-2">
            {[
              { name: "xKaizen", campaign: "NFL - Superbowl UGC", amount: "$502.50" },
              { name: "Cryptoclipz", campaign: "NFL - Superbowl UGC", amount: "$425.00" },
              { name: "ViralVince", campaign: "NFL - Superbowl UGC", amount: "$365.50" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card-bg px-3 py-4"
              >
                <div
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
                  style={{ backgroundColor: AVATAR_COLORS[item.name.length % AVATAR_COLORS.length] }}
                >
                  {item.name[0]}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                    {item.name}
                  </span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                    {item.campaign}
                  </span>
                </div>
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/70">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reason for selection */}
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
            Reason for selected
          </span>
          <div className="flex flex-wrap gap-2">
            {CLAWBACK_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-full border px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                  selectedReason === reason
                    ? "border-foreground text-page-text"
                    : "border-border bg-card-bg text-foreground/70 hover:border-foreground/20",
                )}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* Internal note */}
        <div className="flex w-full flex-col gap-2">
          <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
            Internal note (optional)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context for your team..."
            className="h-[74px] w-full resize-none rounded-xl border border-border bg-card-bg p-4 font-inter text-xs tracking-[-0.02em] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-foreground/30"
          />
        </div>

        {/* Info text */}
        <p className="text-center font-inter text-xs leading-[1.4] tracking-[-0.02em] text-foreground/70">
          Clawbacks are deducted from creators&apos; next payouts. If their balance is insufficient, it will be flagged for manual review. Creators will be notified via email and in-app.
        </p>
      </div>

      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-2 px-5 pb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          Cancel
        </button>
        <button
          type="button"
          className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,37,37,0.06)] font-inter text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.10)]"
        >
          Confirm Clawback (3 payouts)
        </button>
      </div>
    </>
  );
}

function PayoutDetailDialog({
  row,
  index,
  onClose,
}: {
  row: PayoutRow;
  index: number;
  onClose: () => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [showClawback, setShowClawback] = useState(false);
  const tab: PayoutDetailTab = tabIndex === 0 ? "review" : "history";

  if (showClawback) {
    return (
      <Modal open onClose={onClose} showClose={false}>
        <ClawbackView row={row} onClose={onClose} onBack={() => setShowClawback(false)} />
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose}>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
          {/* Header: avatar + name + handle + campaign */}
          <div className="flex w-full flex-col items-start gap-4 px-5 pt-5">
            <div className="flex items-center gap-2">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
              >
                {row.name[0]}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                  {row.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    @{row.name.toLowerCase()}
                  </span>
                  <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">
                    ·
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    {row.campaign}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} variant="underline">
            <TabItem label="Review payment" index={0} />
            <TabItem label="Payout history" index={1} />
          </Tabs>

          {/* Tab content */}
          {tab === "review" ? (
            <div className="flex w-full flex-col gap-4 px-5 pb-5 pt-4 sm:min-h-[340px]">
              {/* Stat cards row */}
              <div className="flex items-center gap-2">
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-[#00B259]">
                    {row.estPayout}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Est. payout
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    N/A
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Flag deadline
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                      81
                    </span>
                    <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text-subtle">
                      Legit
                    </span>
                  </div>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Bot score
                  </span>
                </div>
              </div>

              {/* Submission section */}
              <div className="flex flex-col gap-2">
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  Submission
                </span>

                {/* URL pill */}
                <div className="flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                  <PlatformIcon platform="tiktok" size={16} />
                  <span className="flex-1 truncate font-inter text-sm leading-[1.2] tracking-[-0.02em] text-page-text">
                    https://www.tiktok.com/@{row.name.toLowerCase()}/video/7447157783801203990
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-subtle">
                    <path d="M5 11L11 5M11 5H5M11 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Post preview card */}
                <div className="flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                  {/* Thumbnail */}
                  <div className="hidden sm:flex items-center p-1 pl-1">
                    <div
                      className="h-[108px] w-[77px] shrink-0 rounded-xl"
                      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] + "33" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                          keep moving forward
                        </span>
                        <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                          Posted Feb 18
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/[0.06] py-2 pl-2.5 pr-3">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-page-text-muted">
                          <path d="M2.5 8.5L6 2L9.5 8.5H2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
                          Flag
                        </span>
                      </div>
                    </div>

                    {/* Metric pills */}
                    <div className="flex flex-wrap items-center gap-1">
                      {METRIC_PILLS.map((pill) => (
                        <div
                          key={pill.label}
                          className="flex items-center gap-1 rounded-full px-2.5 py-[5px]"
                          style={{ backgroundColor: pill.bg }}
                        >
                          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
                            {pill.label}
                          </span>
                          <span
                            className="font-inter text-xs font-medium leading-none tracking-[-0.02em]"
                            style={{ color: pill.color }}
                          >
                            {pill.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 px-5 pb-5 pt-4 sm:min-h-[340px]">
              {/* History stat cards */}
              <div className="flex items-center gap-2">
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    $208.91
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Total earned
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-[#00B259]">
                    $69.16
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Received
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {row.estPayout}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Pending
                  </span>
                </div>
              </div>

              {/* History table */}
              <div className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                {/* Header */}
                <div className="flex items-center border-b border-card-border px-1">
                  <div className="flex h-9 w-[61px] items-center justify-center px-3">
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Date</span>
                  </div>
                  <div className="flex h-9 min-w-0 flex-1 items-center px-3">
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Title</span>
                  </div>
                  <div className="hidden sm:flex h-9 w-24 items-center justify-end px-3">
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Payout</span>
                  </div>
                  <div className="flex h-9 w-[88px] items-center justify-end px-3">
                    <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Status</span>
                  </div>
                </div>

                {/* Rows */}
                {PAYOUT_HISTORY.map((entry, i) => {
                  const st = STATUS_CONFIG[entry.status];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center px-1",
                        i < PAYOUT_HISTORY.length - 1 && "border-b border-foreground/[0.03]",
                      )}
                    >
                      <div className="flex h-14 w-[61px] items-center px-3">
                        <span className="font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">
                          {entry.date}
                        </span>
                      </div>
                      <div className="flex h-14 min-w-0 flex-1 items-center px-3">
                        <span className="truncate font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
                          {entry.title}
                        </span>
                      </div>
                      <div className="hidden sm:flex h-14 w-24 items-center justify-end px-3">
                        <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
                          {entry.amount}
                        </span>
                      </div>
                      <div className="flex h-14 w-[88px] items-center justify-end px-3">
                        <div
                          className="flex items-center gap-1 rounded-full py-2 pr-2 pl-1.5"
                          style={{ backgroundColor: st.bg }}
                        >
                          {st.icon}
                          <span
                            className="font-inter text-xs font-medium leading-none tracking-[-0.02em]"
                            style={{ color: st.color }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons — sticky at bottom */}
        <div className="flex w-full shrink-0 items-center justify-end gap-2 border-t border-card-border bg-card-bg px-5 py-4 sm:border-t-0 sm:pb-5 sm:pt-0">
          <button
            type="button"
            onClick={() => setShowClawback(true)}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,37,37,0.06)] font-inter text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.10)]"
          >
            Request clawback
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Approve payout
          </button>
        </div>
    </Modal>
  );
}

/* ── Table Row ────────────────────────────────────────────────────── */

function PayoutTableRow({
  row,
  index,
  isLast,
  isSelected,
  onToggle,
  onRowClick,
  registerItem,
}: {
  row: PayoutRow;
  index: number;
  isLast: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onRowClick: () => void;
  registerItem: (index: number, element: HTMLElement | null) => void;
}) {
  const status = STATUS_CONFIG[row.status];
  const isFlagged = row.flagged;
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "group relative z-10 flex w-full cursor-pointer items-center px-1 transition-colors",
        isFlagged && "bg-[rgba(255,37,37,0.03)] dark:bg-[rgba(255,37,37,0.06)]",
        isSelected && !isFlagged && "bg-foreground/[0.02]",
      )}
      onClick={onRowClick}
    >
      <div className="flex h-14 w-12 items-center justify-center px-3 pr-5">
        <Checkbox checked={isSelected} onChange={onToggle} />
      </div>
      <div
        className={cn(
          "flex flex-1 items-center",
          !isLast && "border-b border-foreground/[0.03]",
        )}
      >
        {/* Creator */}
        <div className="flex h-14 w-[180px] shrink-0 items-center gap-2 py-3 pr-3 lg:w-[240px]">
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
        <div className="flex h-14 w-[140px] shrink-0 items-center justify-end py-3 pl-5 pr-3">
          <div className="flex items-center gap-1">
            {row.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
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
            className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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
  const [activeStatusFilter, setActiveStatusFilter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailRow, setDetailRow] = useState<{ row: PayoutRow; index: number } | null>(null);
  const [sortKey, setSortKey] = useState<PayoutSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = useCallback((key: PayoutSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }, [sortKey]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return PAYOUT_ROWS;
    return [...PAYOUT_ROWS].sort((a, b) => {
      const aVal = getPayoutSortValue(a, sortKey);
      const bVal = getPayoutSortValue(b, sortKey);
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [sortKey, sortDir]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(tableContainerRef);

  useEffect(() => { measureItems(); }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

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

  return (
    <div>
      {/* Top nav */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Payouts
          </span>
        </div>

        {/* Time filter */}
        <Tabs selectedIndex={activeFilter} onSelect={setActiveFilter}>
          {TIME_FILTERS.map((label, i) => (
            <TabItem key={label} label={label} index={i} />
          ))}
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
        {/* Stat cards row */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex min-w-0 flex-col items-start justify-center gap-2 rounded-2xl border border-card-border bg-card-bg p-3"
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

        {/* Status filter tabs */}
        <div className="flex">
          <Tabs selectedIndex={activeStatusFilter} onSelect={setActiveStatusFilter}>
            {STATUS_FILTERS.map((filter, i) => (
              <TabItem key={filter.label} label={`${filter.label} (${filter.count})`} index={i} />
            ))}
          </Tabs>
        </div>

        {/* Table */}
        <div className="flex min-w-0 flex-col items-start justify-center overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <div className="w-full overflow-x-auto">
          {/* Header row */}
          <div className="flex w-full min-w-[800px] items-center border-b border-card-border px-1">
            <div className="flex h-10 w-12 items-center justify-center px-3 pr-5">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
              />
            </div>
            <div className="flex flex-1 items-center">
              {PAYOUT_COLUMNS.map((col, idx) => {
                const isSorted = col.sortKey !== null && sortKey === col.sortKey;
                return (
                  <div
                    key={col.label}
                    className={cn(
                      "flex h-9 items-center py-3 pl-5 pr-3",
                      idx === 0 ? "w-[180px] shrink-0 pl-0 lg:w-[240px]" : idx === 1 ? "w-[140px] shrink-0 justify-end" : "min-w-0 flex-1 justify-end",
                    )}
                  >
                    {col.sortKey ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.sortKey!)}
                        className={cn(
                          "flex cursor-pointer items-center gap-1 whitespace-nowrap font-[family-name:var(--font-inter)] text-xs font-medium leading-none tracking-[-0.02em] transition-colors",
                          isSorted ? "text-page-text" : "text-page-text-muted hover:text-page-text",
                        )}
                      >
                        {col.label}
                        {isSorted && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                            <path
                              d={sortDir === "asc" ? "M2.5 6.5L5 3.5L7.5 6.5" : "M2.5 3.5L5 6.5L7.5 3.5"}
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium leading-none tracking-[-0.02em] text-page-text-muted">
                        {col.label}
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="flex h-9 w-20 items-center justify-end py-3 pl-5 pr-4">
                <span className="text-page-text-muted opacity-0">Status</span>
              </div>
            </div>
          </div>

          {/* Data rows */}
          <div
            className="relative w-full min-w-[800px] overflow-hidden"
            ref={tableContainerRef}
            onMouseEnter={handlers.onMouseEnter}
            onMouseMove={handlers.onMouseMove}
            onMouseLeave={handlers.onMouseLeave}
          >
            <AnimatePresence>
              {activeRect && (
                <motion.div
                  key={sessionRef.current}
                  className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                  initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                  animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {sortedRows.map((row, i) => (
              <PayoutTableRow
                key={row.id}
                row={row}
                index={i}
                isLast={i === sortedRows.length - 1}
                isSelected={selectedIds.has(row.id)}
                onToggle={() => toggleRow(row.id)}
                onRowClick={() => setDetailRow({ row, index: i })}
                registerItem={registerItem}
              />
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Payout detail dialog */}
      {detailRow && (
        <PayoutDetailDialog
          row={detailRow.row}
          index={detailRow.index}
          onClose={() => setDetailRow(null)}
        />
      )}
    </div>
  );
}
