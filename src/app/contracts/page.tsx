"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";

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
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="#FF2525" strokeWidth="1.2" />
      <path d="M6 3.5V6L7.5 7" stroke="#FF2525" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="2" r="1.5" fill="#FF2525" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="#FF9025" strokeWidth="1.2" />
      <path d="M6 3.5V6L7.5 7" stroke="#FF9025" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 2.5C1.5 1.95 1.95 1.5 2.5 1.5H9.5C10.05 1.5 10.5 1.95 10.5 2.5V7.5C10.5 8.05 10.05 8.5 9.5 8.5H4L2 10.5V8.5H2.5C1.95 8.5 1.5 8.05 1.5 7.5V2.5Z" fill="#3B82F6" />
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

const COLUMNS = [
  { label: "Creator", width: "w-[244px]", align: "text-left" as const, grow: false },
  { label: "Type", width: "", align: "text-right" as const, grow: true },
  { label: "Compensation", width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Deliverables", width: "w-[144px]", align: "text-right" as const, grow: false },
  { label: "Status", width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Duration", width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Ends", width: "w-[128px]", align: "text-right" as const, grow: false },
  { label: "Actions", width: "w-[104px]", align: "text-right" as const, grow: false },
];

// ── Contract Row ─────────────────────────────────────────────────────

function ContractRow({ contract, isLast }: { contract: Contract; isLast: boolean }) {
  const rowOpacity = contract.dimmed ? "opacity-70" : "";

  return (
    <div className="flex items-center px-1">
      <div className={cn("flex flex-1 items-center", !isLast && "border-b border-foreground/[0.03]")}>
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

// ── Page ─────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const [selectedFilter, setSelectedFilter] = useState(0);

  return (
    <div className="min-h-full bg-page-bg">
      {/* Top nav */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Contracts
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center px-4 pt-5 sm:px-5">
        <Tabs selectedIndex={selectedFilter} onSelect={setSelectedFilter}>
          {CONTRACT_FILTERS.map((tab, i) => (
            <TabItem key={tab.label} label={tab.label} count={tab.count} index={i} />
          ))}
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Table card */}
        <div className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Table scrollable wrapper */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: 1000 }}>
              {/* Header */}
              <div className="flex items-center border-b border-foreground/[0.06] px-1">
                <div className="flex flex-1 items-center">
                  {COLUMNS.map((col) => (
                    <div
                      key={col.label}
                      className={cn(
                        "flex shrink-0 items-center px-3 py-3",
                        col.grow ? "min-w-0 flex-1 pl-5" : col.width,
                        col.align === "text-right" && "justify-end",
                        col.label === "Creator" ? "" : "pl-5",
                      )}
                    >
                      <span
                        className={cn(
                          "font-inter text-xs font-medium leading-none tracking-[-0.02em]",
                          col.align,
                        )}
                        style={{ color: "rgba(37,37,37,0.5)" }}
                      >
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              {CONTRACTS.map((contract, i) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  isLast={i === CONTRACTS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
