"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

// ── Icons ───────────────────────────────────────────────────────────

function ActiveDotIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" fill="#00B259" />
    </svg>
  );
}

function ClockAlertIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M0.146447 1.64645C-0.0488155 1.84171 -0.0488155 2.15829 0.146447 2.35355C0.341709 2.54882 0.658291 2.54882 0.853554 2.35355L2.35355 0.853553C2.54882 0.658291 2.54882 0.341709 2.35355 0.146447C2.15829 -0.0488156 1.84171 -0.0488155 1.64645 0.146447L0.146447 1.64645Z" fill="#FF2525"/>
      <path d="M9.35355 0.146447C9.15829 -0.0488155 8.84171 -0.0488155 8.64645 0.146447C8.45119 0.341709 8.45119 0.658291 8.64645 0.853554L10.1464 2.35355C10.3417 2.54882 10.6583 2.54882 10.8536 2.35355C11.0488 2.15829 11.0488 1.84171 10.8536 1.64645L9.35355 0.146447Z" fill="#FF2525"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.4999 5.375C10.4999 8.13643 8.26135 10.375 5.49993 10.375C2.7385 10.375 0.499925 8.13643 0.499925 5.375C0.499925 2.61358 2.7385 0.375 5.49993 0.375C8.26135 0.375 10.4999 2.61358 10.4999 5.375ZM5.49993 2.875C5.77607 2.875 5.99993 3.09886 5.99993 3.375V5.16789L7.10348 6.27145C7.29874 6.46671 7.29874 6.78329 7.10348 6.97855C6.90822 7.17382 6.59163 7.17382 6.39637 6.97855L5.14637 5.72855C5.0526 5.63479 4.99993 5.50761 4.99993 5.375V3.375C4.99993 3.09886 5.22378 2.875 5.49993 2.875Z" fill="#FF2525"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="#FF9025"/>
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
      <path d="M5.25 0C6.78235 0 8.09493 0.395804 9.03372 1.17846C9.98342 1.97021 10.5 3.11674 10.5 4.5C10.5 5.88327 9.98342 7.02979 9.03372 7.82155C8.09493 8.6042 6.78235 9 5.25 9C4.44037 9 3.52872 8.92525 2.70788 8.5689C2.56832 8.64689 2.37617 8.74171 2.14798 8.82086C1.67237 8.98585 0.979516 9.10235 0.285961 8.77383C0.149876 8.70937 0.0500903 8.58701 0.0143179 8.44074C-0.0214544 8.29447 0.0105986 8.13987 0.101572 8.01988C0.44577 7.5659 0.554238 7.21384 0.584277 6.98869C0.613188 6.77199 0.572714 6.64783 0.568022 6.6344L0.568351 6.6352C0.568351 6.6352 0.568054 6.63445 0.567614 6.63325L0.568022 6.6344C0.568022 6.6344 0.567496 6.63312 0.567048 6.63206L0.56321 6.62303L0.55682 6.60791C0.518528 6.51611 0.38304 6.18455 0.256298 5.78898C0.134671 5.40937 4.23188e-06 4.90824 4.23188e-06 4.5C4.23188e-06 3.11674 0.516586 1.97021 1.46629 1.17846C2.40508 0.395804 3.71766 0 5.25 0Z" fill="#3B82F6"/>
    </svg>
  );
}

function DurationIndicator({ fraction }: { fraction: number }) {
  const r = 5;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - fraction);
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 -rotate-90">
      <circle cx="6" cy="6" r={r} fill="none" stroke="rgba(37,37,37,0.2)" strokeWidth="1.33" />
      <circle cx="6" cy="6" r={r} fill="none" stroke="#252525" strokeWidth="1.33" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────

type ContractStatus = "active" | "expiring" | "pending" | "negotiation" | "expired";

interface Contract {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  type: string;
  compensation: string;
  deliverables: string;
  status: ContractStatus;
  duration: string;
  durationFraction: number;
  ends: string;
  actionLabel: string;
  actionVariant: "default" | "green" | "primary";
  dimmed?: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────

const CONTRACTS: Contract[] = [
  {
    id: 1, name: "xKaizen", handle: "xKaizen", avatar: "https://i.pravatar.cc/48?img=11",
    type: "Full exclusivity", compensation: "$2,500/mo", deliverables: "4 posts/mo",
    status: "active", duration: "6 months", durationFraction: 0.65, ends: "Aug 15, 2026",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 2, name: "Cryptoclipz", handle: "Cryptoclipz", avatar: "https://i.pravatar.cc/48?img=12",
    type: "Category exclusivity", compensation: "$4.50 CPM", deliverables: "Min 3 posts/mo",
    status: "active", duration: "Ongoing", durationFraction: 1, ends: "Rolling",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 3, name: "ViralVince", handle: "ViralVince", avatar: "https://i.pravatar.cc/48?img=13",
    type: "Full exclusivity", compensation: "$3,200/mo", deliverables: "6 posts/mo",
    status: "active", duration: "6 months", durationFraction: 0.65, ends: "Jul 1, 2026",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 4, name: "TechnoTrade", handle: "TechnoTrade", avatar: "https://i.pravatar.cc/48?img=14",
    type: "Platform exclusivity", compensation: "$375/post", deliverables: "4 posts/mo target",
    status: "active", duration: "Ongoing", durationFraction: 1, ends: "Jul 1, 2026",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 5, name: "GamingGrace", handle: "GamingGrace", avatar: "https://i.pravatar.cc/48?img=15",
    type: "Full exclusivity", compensation: "$3.50 CPM", deliverables: "Min 3 posts/mo",
    status: "expiring", duration: "3 months", durationFraction: 0.9, ends: "Mar 18, 2026",
    actionLabel: "Renew", actionVariant: "green",
  },
  {
    id: 6, name: "BetBoss", handle: "BetBoss", avatar: "https://i.pravatar.cc/48?img=16",
    type: "Category exclusivity", compensation: "$850/post", deliverables: "2 posts/mo target",
    status: "expiring", duration: "6 months", durationFraction: 0.9, ends: "Rolling",
    actionLabel: "Renew", actionVariant: "green",
  },
  {
    id: 7, name: "ClipKingJr", handle: "ClipKingJr", avatar: "https://i.pravatar.cc/48?img=17",
    type: "Full exclusivity", compensation: "$1,500/mo", deliverables: "4 posts/mo",
    status: "active", duration: "6 months", durationFraction: 0.65, ends: "Jun 10, 2026",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 8, name: "NeonEdits", handle: "NeonEdits", avatar: "https://i.pravatar.cc/48?img=18",
    type: "No exclusivity", compensation: "$200/post", deliverables: "As needed",
    status: "pending", duration: "6 months", durationFraction: 0, ends: "When complete",
    actionLabel: "Sign", actionVariant: "primary",
  },
  {
    id: 9, name: "ReelMaster", handle: "ReelMaster", avatar: "https://i.pravatar.cc/48?img=19",
    type: "Full exclusivity", compensation: "$2,800/mo", deliverables: "5 posts/mo",
    status: "pending", duration: "Per campaign", durationFraction: 0, ends: "Sep 6, 2026",
    actionLabel: "Sign", actionVariant: "primary",
  },
  {
    id: 10, name: "WealthWave", handle: "WealthWave", avatar: "https://i.pravatar.cc/48?img=20",
    type: "Category exclusivity", compensation: "$5.00 CPM", deliverables: "Min 3 posts/mo",
    status: "negotiation", duration: "6 months", durationFraction: 0.5, ends: "Rolling",
    actionLabel: "View", actionVariant: "default",
  },
  {
    id: 11, name: "StableAssets", handle: "StableAssets", avatar: "https://i.pravatar.cc/48?img=21",
    type: "Category exclusivity", compensation: "$600/post", deliverables: "3 posts total",
    status: "expired", duration: "Per campaign", durationFraction: 0, ends: "When complete",
    actionLabel: "Re-sign", actionVariant: "default", dimmed: true,
  },
];

// ── Status Badge ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContractStatus }) {
  const config = {
    active: { icon: <ActiveDotIcon />, label: "Active", bg: "rgba(0,178,89,0.1)", color: "#00B259" },
    expiring: { icon: <ClockAlertIcon />, label: "Expiring", bg: "rgba(255,37,37,0.1)", color: "#FF2525" },
    pending: { icon: <ClockIcon />, label: "Pending", bg: "rgba(255,144,37,0.1)", color: "#FF9025" },
    negotiation: { icon: <ChatBubbleIcon />, label: "Negotiation", bg: "rgba(59,130,246,0.1)", color: "#3B82F6" },
    expired: { icon: null, label: "Expired", bg: "rgba(37,37,37,0.06)", color: "rgba(37,37,37,0.5)" },
  }[status];

  return (
    <div
      className="flex items-center gap-1 rounded-full py-1.5 pl-1.5 pr-2"
      style={{ background: config.bg }}
    >
      {config.icon && <span className="flex size-3 items-center justify-center">{config.icon}</span>}
      <span
        className="font-inter text-xs font-medium leading-none tracking-[-0.02em]"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
}

// ── Action Button ────────────────────────────────────────────────────

function ActionButton({ label, variant }: { label: string; variant: "default" | "green" | "primary" }) {
  const styles = {
    default: "bg-foreground/[0.06] text-page-text",
    green: "bg-[#00B259] text-white",
    primary: "bg-foreground text-white dark:bg-white dark:text-foreground",
  }[variant];

  return (
    <button className={cn("flex h-8 items-center rounded-full px-3 font-inter text-xs font-medium tracking-[-0.02em]", styles)}>
      {label}
    </button>
  );
}

// ── Table Header ─────────────────────────────────────────────────────

type ContractSortKey = "creator" | "type" | "compensation" | "status" | "duration" | "ends";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<ContractStatus, number> = { active: 0, expiring: 1, pending: 2, negotiation: 3, expired: 4 };

function getContractSortValue(c: Contract, key: ContractSortKey): number | string {
  switch (key) {
    case "creator": return c.name.toLowerCase();
    case "type": return c.type.toLowerCase();
    case "compensation": return parseFloat(c.compensation.replace(/[^0-9.]/g, "")) || 0;
    case "status": return STATUS_ORDER[c.status];
    case "duration": return c.durationFraction;
    case "ends": return c.ends === "Rolling" || c.ends === "When complete" ? "zzz" : c.ends;
  }
}

const COLUMNS = [
  { label: "Creator", sortKey: "creator" as ContractSortKey | null, width: "w-[244px]", align: "text-left" as const, grow: false },
  { label: "Type", sortKey: "type" as ContractSortKey | null, width: "", align: "text-right" as const, grow: true },
  { label: "Compensation", sortKey: "compensation" as ContractSortKey | null, width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Deliverables", sortKey: null as ContractSortKey | null, width: "w-[144px]", align: "text-right" as const, grow: false },
  { label: "Status", sortKey: "status" as ContractSortKey | null, width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Duration", sortKey: "duration" as ContractSortKey | null, width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Ends", sortKey: "ends" as ContractSortKey | null, width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Actions", sortKey: null as ContractSortKey | null, width: "w-[104px]", align: "text-right" as const, grow: false },
];

// ── Contract Row ─────────────────────────────────────────────────────

function ContractRow({
  contract,
  index,
  isLast,
  registerItem,
  activeIndex,
}: {
  contract: Contract;
  index: number;
  isLast: boolean;
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}) {
  const rowOpacity = contract.dimmed ? "opacity-70" : "";
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const hideBorder = activeIndex !== null && (index === activeIndex || index === activeIndex - 1);

  return (
    <div ref={rowRef} className="flex items-center px-1">
      <div className={cn("flex flex-1 items-center transition-[border-color] duration-75", !isLast && cn("border-b", hideBorder ? "border-transparent" : "border-foreground/[0.03]"))}>
        {/* Creator */}
        <div className={cn("flex w-[244px] shrink-0 items-center gap-2 px-3 py-3", rowOpacity)}>
          <img src={contract.avatar} alt="" className="size-6 shrink-0 rounded-full object-cover" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
              {contract.name}
            </span>
            <span className="truncate font-inter text-xs leading-none tracking-[-0.02em]" style={{ color: "rgba(37,37,37,0.5)" }}>
              {contract.handle}
            </span>
          </div>
        </div>

        {/* Type */}
        <div className={cn("flex min-w-0 flex-1 items-center justify-end px-3 py-3 pl-5", rowOpacity)}>
          <span className="truncate font-inter text-xs leading-none tracking-[-0.02em] text-page-text text-right">
            {contract.type}
          </span>
        </div>

        {/* Compensation */}
        <div className={cn("flex w-[128px] shrink-0 items-center justify-end px-3 py-3 pl-5", rowOpacity)}>
          <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text text-right">
            {contract.compensation}
          </span>
        </div>

        {/* Deliverables */}
        <div className={cn("flex w-[144px] shrink-0 items-center justify-end px-3 py-3 pl-5", rowOpacity)}>
          <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text text-right">
            {contract.deliverables}
          </span>
        </div>

        {/* Status */}
        <div className={cn("flex w-[128px] shrink-0 items-center justify-end px-3 py-3 pl-5", rowOpacity)}>
          <StatusBadge status={contract.status} />
        </div>

        {/* Duration */}
        <div className={cn("flex w-[128px] shrink-0 items-center justify-end gap-1.5 px-3 py-3 pl-5", rowOpacity)}>
          <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text text-right">
            {contract.duration}
          </span>
          {contract.durationFraction > 0 && contract.durationFraction < 1 && (
            <DurationIndicator fraction={contract.durationFraction} />
          )}
        </div>

        {/* Ends */}
        <div className={cn("flex w-[128px] shrink-0 items-center justify-end px-3 py-3 pl-5", rowOpacity)}>
          <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text text-right">
            {contract.ends}
          </span>
        </div>

        {/* Actions */}
        <div className="flex w-[104px] shrink-0 items-center justify-end px-3 py-3 pl-5">
          <ActionButton label={contract.actionLabel} variant={contract.actionVariant} />
        </div>
      </div>
    </div>
  );
}

// ── Filter Tabs ──────────────────────────────────────────────────────

const CONTRACT_FILTERS = [
  { label: "All", count: 18 },
  { label: "Active", count: 5 },
  { label: "Pending", count: 6 },
  { label: "Expiring soon", count: 5 },
  { label: "NDAs", count: 3 },
  { label: "Expired", count: 3 },
];

// ── Contract Types ───────────────────────────────────────────────────

const CONTRACT_TYPES = [
  "Retainer",
  "Per Post",
  "CPM",
  "UGC / License",
  "Affiliate",
  "Ambassador",
];

const DURATION_OPTIONS = ["1 month", "3 months", "6 months", "12 months", "Ongoing"];

const MOCK_SELECTED_PAYOUTS = [
  { name: "xKaizen", campaign: "NFL - Superbowl UGC", amount: "$502.50", avatar: "https://i.pravatar.cc/48?img=11" },
  { name: "Cryptoclipz", campaign: "NFL - Superbowl UGC", amount: "$425.00", avatar: "https://i.pravatar.cc/48?img=12" },
  { name: "ViralVince", campaign: "NFL - Superbowl UGC", amount: "$365.50", avatar: "https://i.pravatar.cc/48?img=13" },
];

function SendIcon() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
      <path d="M0.50446 2.37563C-0.481509 1.58905 0.0746884 0 1.33597 0H13.3823C14.4061 0 15.048 1.10618 14.5398 1.99506L8.64431 12.3079C8.0281 13.3858 6.40259 13.1104 6.17585 11.8897L5.2135 6.70834L9.02748 4.54003C9.34756 4.35806 9.45952 3.95107 9.27755 3.63099C9.09558 3.31091 8.68859 3.19895 8.36851 3.38092L4.51252 5.57312L0.50446 2.37563Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewContractModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [contractType, setContractType] = useState("CPM");
  const [duration, setDuration] = useState("3 months");
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  return (
    <Modal open={open} onClose={onClose} showClose={false}>
      <div className="relative flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-foreground/[0.06] px-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            New Creator Contract
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex flex-col items-center gap-4 overflow-y-auto p-5">
          {/* Subtitle */}
          <p className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            Easily set up an agreement with a creator.
          </p>

          {/* Contract type */}
          <div className="flex w-full flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Contract type
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {CONTRACT_TYPES.map((type) => {
                const isSelected = contractType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setContractType(type)}
                    className={cn(
                      "flex h-7 cursor-pointer items-center justify-center rounded-full px-3 font-inter text-xs font-medium tracking-[-0.02em] transition-colors",
                      isSelected
                        ? "border border-[#1A67E5] text-[#1A67E5]"
                        : "border border-foreground/[0.06] bg-card-bg text-foreground/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-foreground/[0.04]",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Creator */}
          <div className="flex w-full flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Creator
            </span>
            <div className="flex h-[38px] items-center justify-between rounded-xl border border-foreground/[0.06] bg-card-bg px-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/30">
                Select a creator...
              </span>
              <span className="text-foreground/50">
                <ChevronDownSmallIcon />
              </span>
            </div>
          </div>

          {/* Monthly rate + Duration */}
          <div className="flex w-full gap-4">
            {/* Monthly rate */}
            <div className="flex flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Monthly rate
              </span>
              <div className="flex h-[38px] items-center rounded-xl border border-foreground/[0.06] bg-card-bg px-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="font-inter text-xs tracking-[-0.02em] text-foreground/30">$</span>
                <span className="ml-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text">2,000</span>
              </div>
            </div>

            {/* Duration */}
            <div className="relative flex flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Duration
              </span>
              <button
                type="button"
                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                className="flex h-[38px] cursor-pointer items-center justify-between rounded-xl border border-foreground/[0.06] bg-card-bg px-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{duration}</span>
                <span className="text-foreground/50">
                  <ChevronDownSmallIcon />
                </span>
              </button>
              {showDurationDropdown && (
                <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-xl border border-foreground/[0.06] bg-card-bg py-1 shadow-lg">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setDuration(opt);
                        setShowDurationDropdown(false);
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center px-3 py-2 font-inter text-xs tracking-[-0.02em] transition-colors hover:bg-foreground/[0.04]",
                        duration === opt ? "font-medium text-page-text" : "text-foreground/70",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Payouts */}
          <div className="flex w-full flex-col gap-3 rounded-2xl bg-foreground/[0.02] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Selected Payouts
              </span>
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                $1,293.00
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {MOCK_SELECTED_PAYOUTS.map((payout) => (
                <div
                  key={payout.name}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg px-3 py-4"
                >
                  <img
                    src={payout.avatar}
                    alt=""
                    className="size-6 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                      {payout.name}
                    </span>
                    <span className="truncate font-inter text-xs tracking-[-0.02em] text-foreground/50">
                      {payout.campaign}
                    </span>
                  </div>
                  <span className="shrink-0 font-inter text-xs font-medium tracking-[-0.02em] text-foreground/70">
                    {payout.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional information */}
          <div className="flex w-full flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Additional information (optional)
            </span>
            <div className="rounded-xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <textarea
                className="w-full resize-none bg-transparent font-inter text-xs tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/30"
                placeholder="Notes, brand guidelines, posting schedule, special requirements..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer — fixed at bottom */}
        <div className="flex shrink-0 items-center justify-between gap-4 bg-card-bg px-5 pb-5 pt-4">
          <p className="max-w-[215px] font-inter text-[10px] leading-[1.4] tracking-[-0.02em] text-foreground/70">
            The creator will receive this contract for review. They can accept, request changes, or decline.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:bg-white dark:text-foreground dark:hover:bg-white/90"
            >
              <SendIcon />
              Send Contract
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [sortKey, setSortKey] = useState<ContractSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [newContractOpen, setNewContractOpen] = useState(false);

  const handleSort = useCallback((key: ContractSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }, [sortKey]);

  const sortedContracts = useMemo(() => {
    if (!sortKey) return CONTRACTS;
    return [...CONTRACTS].sort((a, b) => {
      const aVal = getContractSortValue(a, sortKey);
      const bVal = getContractSortValue(b, sortKey);
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

  return (
    <div className="min-h-full bg-page-bg">
      {/* Top nav */}
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Contracts
        </span>
        <button
          type="button"
          onClick={() => setNewContractOpen(true)}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-3 font-inter text-xs font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:bg-white dark:text-foreground dark:hover:bg-white/90"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Contract
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
        {/* Filter tabs - left aligned */}
        <div className="flex">
          <Tabs selectedIndex={selectedFilter} onSelect={setSelectedFilter}>
            {CONTRACT_FILTERS.map((tab, i) => (
              <TabItem key={tab.label} label={tab.label} count={tab.count} index={i} />
            ))}
          </Tabs>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Table scrollable wrapper */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: 1000 }}>
              {/* Header */}
              <div className="flex items-center border-b border-foreground/[0.06] px-1">
                <div className="flex flex-1 items-center">
                  {COLUMNS.map((col) => {
                    const isSorted = col.sortKey !== null && sortKey === col.sortKey;
                    const isSortable = col.sortKey !== null;
                    return (
                      <div
                        key={col.label}
                        className={cn(
                          "flex shrink-0 items-center px-3 py-3",
                          col.grow ? "min-w-0 flex-1 pl-5" : col.width,
                          col.align === "text-right" && "justify-end",
                          col.label === "Creator" ? "" : "pl-5",
                        )}
                      >
                        {isSortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(col.sortKey!)}
                            className={cn(
                              "flex cursor-pointer items-center gap-1 whitespace-nowrap font-inter text-xs font-medium leading-none tracking-[-0.02em] transition-colors",
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
                          <span
                            className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text-muted"
                          >
                            {col.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rows */}
              <div
                className="relative w-full overflow-hidden"
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
                {sortedContracts.map((contract, i) => (
                  <ContractRow
                    key={contract.id}
                    contract={contract}
                    index={i}
                    isLast={i === sortedContracts.length - 1}
                    registerItem={registerItem}
                    activeIndex={activeIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewContractModal open={newContractOpen} onClose={() => setNewContractOpen(false)} />
    </div>
  );
}
