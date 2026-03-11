"use client";

import { useState, type SVGProps } from "react";
import { cn } from "@/lib/utils";
import type {
  AffiliateCode,
  AffiliateMetrics,
  AffiliateChartPoint,
  AffiliateReferredUser,
  AffiliateTimeframe,
} from "@/types/affiliate.types";
import { EarningsChart } from "./EarningsChart";
import { MonthlyLeaderboard } from "./MonthlyLeaderboard";
import { RecentActivity } from "./RecentActivity";
import { ReferralLinkBar } from "./ReferralLinkBar";
import { StatsCards } from "./StatsCards";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_CODES: AffiliateCode[] = [
  { id: "c1", code: "DEMO123", clicks: 3842, referrals: 127, destinationPath: "/", isActive: true },
  { id: "c2", code: "SUMMER24", clicks: 1205, referrals: 42, destinationPath: "/", isActive: true },
  { id: "c3", code: "OLD2023", clicks: 580, referrals: 15, destinationPath: "/", isActive: false },
];

const DEMO_METRICS: AffiliateMetrics = {
  totalClicks: 3842,
  totalReferrals: 127,
  totalEarnings: 481500, // in cents = $4,815
};

const DEMO_CHART: AffiliateChartPoint[] = [
  { date: "2025-01-01", clicks: 20, referrals: 5 },
  { date: "2025-01-15", clicks: 45, referrals: 12 },
  { date: "2025-02-01", clicks: 35, referrals: 10 },
  { date: "2025-02-15", clicks: 60, referrals: 22 },
  { date: "2025-03-01", clicks: 50, referrals: 18 },
  { date: "2025-03-15", clicks: 75, referrals: 30 },
  { date: "2025-04-01", clicks: 65, referrals: 25 },
  { date: "2025-04-15", clicks: 90, referrals: 40 },
  { date: "2025-05-01", clicks: 80, referrals: 35 },
  { date: "2025-05-15", clicks: 95, referrals: 48 },
  { date: "2025-06-01", clicks: 85, referrals: 42 },
  { date: "2025-06-15", clicks: 100, referrals: 55 },
];

const DEMO_REFERRED_USERS: AffiliateReferredUser[] = [
  { id: "r1", name: "xKaizen", username: "xkaizen", avatarUrl: null, joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "r2", name: "StellarMike", username: "stellarmike", avatarUrl: null, joinedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "r3", name: "NovaCraft", username: "novacraft", avatarUrl: null, joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "r4", name: "PixelDrift", username: "pixeldrift", avatarUrl: null, joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "r5", name: "CosmicLuna", username: "cosmicluna", avatarUrl: null, joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

// ── Milestone Icons ──────────────────────────────────────────────────────────

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM13.5805 7.97492C13.8427 7.65434 13.7955 7.18183 13.4749 6.91953C13.1544 6.65724 12.6819 6.70449 12.4196 7.02507L8.44431 11.8837L6.03033 9.46967C5.73744 9.17678 5.26256 9.17678 4.96967 9.46967C4.67678 9.76256 4.67678 10.2374 4.96967 10.5303L7.96967 13.5303C8.11953 13.6802 8.32573 13.7596 8.53737 13.7491C8.74901 13.7386 8.94629 13.639 9.08046 13.4749L13.5805 7.97492Z" fill="currentColor"/>
    </svg>
  );
}

function InfoCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 1.667A8.333 8.333 0 1 0 10 18.333 8.333 8.333 0 0 0 10 1.667ZM10 5.833a.833.833 0 1 1 0 1.667.833.833 0 0 1 0-1.667ZM10 9.167a.833.833 0 0 0-.833.833v3.333a.833.833 0 0 0 1.667 0V10a.833.833 0 0 0-.834-.833Z" fill="currentColor"/>
    </svg>
  );
}

function GiftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.25 4.08333V2.97222M6.25 4.08333H5.13889C3.91159 4.08333 2.91667 3.08841 2.91667 1.86111C2.91667 1.24746 3.41413 0.75 4.02778 0.75C5.25508 0.75 6.25 1.74492 6.25 2.97222M6.25 4.08333H7.36111C8.58841 4.08333 9.58333 3.08841 9.58333 1.86111C9.58333 1.24746 9.08587 0.75 8.47222 0.75C7.24492 0.75 6.25 1.74492 6.25 2.97222M6.25 4.08333H1.41667C1.04848 4.08333 0.75 4.38181 0.75 4.75V6.25C0.75 6.61819 1.04848 6.91667 1.41667 6.91667M6.25 4.08333H11.0833C11.4515 4.08333 11.75 4.38181 11.75 4.75V6.25C11.75 6.61819 11.4515 6.91667 11.0833 6.91667M6.25 4.08333V6.91667M6.25 12.4167H2.08333C1.71514 12.4167 1.41667 12.1182 1.41667 11.75V6.91667M6.25 12.4167H10.4167C10.7849 12.4167 11.0833 12.1182 11.0833 11.75V6.91667M6.25 12.4167V6.91667M6.25 6.91667H11.0833M6.25 6.91667H1.41667M1.41667 6.58333V6.91667M11.0833 6.91667V6.58333" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="8.75" stroke="currentColor" strokeWidth="1.25" fill="none"/>
      <circle cx="10" cy="10" r="5.417" stroke="currentColor" strokeWidth="1.25" fill="none"/>
      <circle cx="10" cy="10" r="1.25" stroke="currentColor" strokeWidth="1.25" fill="none"/>
    </svg>
  );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.833 8.333V5.833a4.167 4.167 0 0 1 8.334 0v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none"/>
      <rect x="4.167" y="8.333" width="11.667" height="8.333" rx="2.083" stroke="currentColor" strokeWidth="1.25" fill="none"/>
      <circle cx="10" cy="12.5" r="1.25" fill="currentColor"/>
    </svg>
  );
}

// ── Milestone data ──────────────────────────────────────────────────────────

interface Milestone {
  title: string;
  description: string;
  reward: string;
  status: "completed" | "in-progress" | "locked";
  progress: number; // 0-100
  progressLabel: string;
}

const MILESTONES: Milestone[] = [
  {
    title: "First Steps",
    description: "Refer your first 10 clippers who participate in campaigns",
    reward: "$50 Flat Bonus",
    status: "completed",
    progress: 100,
    progressLabel: "Completed",
  },
  {
    title: "Rising Star",
    description: "Referred clippers earn a combined $500 from approved clips",
    reward: "$100 Flat Bonus",
    status: "completed",
    progress: 100,
    progressLabel: "Completed",
  },
  {
    title: "Power Affiliate",
    description: "Refer 50 clippers with at least 1 approved clip each",
    reward: "$250 Flat Bonus",
    status: "in-progress",
    progress: 74,
    progressLabel: "37 / 50",
  },
  {
    title: "Elite Network",
    description: "Referred clippers earn a combined $5,000 from approved clips",
    reward: "$1,000 Flat Bonus",
    status: "locked",
    progress: 44,
    progressLabel: "2,180 / 5,000",
  },
];

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const isCompleted = milestone.status === "completed";
  const isLocked = milestone.status === "locked";

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_2px_var(--card-bg)]",
            isCompleted
              ? "bg-[#00B259]"
              : "border border-foreground/[0.06] bg-card-bg",
          )}
        >
          {isCompleted ? (
            <CheckCircleIcon className="size-5 text-white" />
          ) : isLocked ? (
            <LockIcon className="size-5 text-page-text/70" />
          ) : (
            <TargetIcon className="size-5 text-page-text/70" />
          )}
        </div>

        {/* Text */}
        <div className={cn("flex flex-1 flex-col gap-1", isCompleted && "opacity-50")}>
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            {milestone.title}
          </span>
          <span className="font-inter text-sm leading-[150%] tracking-[-0.02em] text-page-text/70">
            {milestone.description}
          </span>
          <div className="flex items-center gap-1">
            <GiftIcon className={cn("size-4", isCompleted ? "text-[#00B259]" : "text-page-text")} />
            <span className={cn("font-inter text-xs font-medium tracking-[-0.02em]", isCompleted ? "text-[#00B259]" : "text-page-text")}>
              {milestone.reward}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className={cn("relative h-1 w-full overflow-hidden rounded-full", isCompleted ? "bg-[#00B259]" : "bg-foreground/10")}>
          <div
            className={cn("absolute inset-y-0 left-0 rounded-full", isCompleted ? "bg-[#00B259]" : "bg-foreground")}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className={cn("font-inter text-sm font-medium tracking-[-0.02em]", isCompleted ? "text-[#00B259]" : "text-page-text")}>
            {milestone.progressLabel}
          </span>
          <span className={cn("font-inter text-sm font-medium tracking-[-0.02em]", isCompleted ? "text-[#00B259]" : "text-page-text/70")}>
            {milestone.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function MilestoneRewards() {
  const completedCount = MILESTONES.filter((m) => m.status === "completed").length;

  return (
    <div className="flex flex-col gap-4 self-stretch rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between pr-4">
        <div className="flex flex-1 items-center gap-1">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">
            Milestone Rewards
          </span>
          <InfoCircleIcon className="size-4 text-page-text/40" />
        </div>
        <div className="flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3">
          <span className="font-inter text-sm font-medium tracking-[-0.09px] text-page-text">
            {completedCount}/{MILESTONES.length}
          </span>
          <span className="font-inter text-sm tracking-[-0.09px] text-page-text/50">
            Completed
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <MilestoneCard milestone={MILESTONES[0]} />
          <MilestoneCard milestone={MILESTONES[1]} />
        </div>
        <div className="flex gap-2">
          <MilestoneCard milestone={MILESTONES[2]} />
          <MilestoneCard milestone={MILESTONES[3]} />
        </div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function AffiliateDashboardView() {
  const [timeframe, setTimeframe] = useState<AffiliateTimeframe>("lifetime");

  const codes = DEMO_CODES;
  const metrics = DEMO_METRICS;
  const chart = DEMO_CHART;
  const referredUsers = DEMO_REFERRED_USERS;

  return (
    <div
      className="flex flex-col items-center mx-auto w-full px-4 md:px-10"
      style={{ gap: 32, paddingBottom: 40, paddingTop: 24 }}
    >
      {/* Header */}
      <div
        className="flex flex-col justify-center items-start self-stretch"
        style={{ gap: 8 }}
      >
        <h1
          className="text-[28px] font-semibold"
          style={{
            color: "var(--af-text)",
            letterSpacing: "-0.6px",
            lineHeight: "120%",
          }}
        >
          Affiliates
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--af-text-secondary)",
            letterSpacing: "-0.09px",
            lineHeight: "120%",
          }}
        >
          Monitor performance, creator activity, and payouts across all
          platforms.
        </p>
      </div>

      {/* Content */}
      <div
        className="flex flex-col items-start self-stretch"
        style={{ gap: 24 }}
      >
        <MilestoneRewards />

        <ReferralLinkBar codes={codes} />

        <div
          className="flex flex-col items-start self-stretch"
          style={{ gap: 8 }}
        >
          <StatsCards codes={codes} metrics={metrics} />

          {/* Chart + Activity */}
          <div
            className="flex flex-col md:flex-row items-stretch self-stretch"
            style={{ gap: 8 }}
          >
            <EarningsChart
              chart={chart}
              onTimeframeChange={setTimeframe}
              timeframe={timeframe}
            />
            <RecentActivity referredUsers={referredUsers} />
          </div>

          <MonthlyLeaderboard />
        </div>
      </div>
    </div>
  );
}
