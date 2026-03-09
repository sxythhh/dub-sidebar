"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  SlidersHorizontal,
  ChevronRight,
  Music,
  Swords,
  User,
  Users,
  Gamepad2,
  Tv,
  Trophy,
  GraduationCap,
  Heart,
  Cpu,
} from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import CpmEyeIcon from "@/assets/icons/cpm-eye.svg";
import RetainerIcon from "@/assets/icons/retainer.svg";
import PerPostIcon from "@/assets/icons/per-post.svg";
import { ThemeDebugMenu } from "@/components/discover/shared/ThemeDebugMenu";
import { GlassTooltip } from "@/components/ui/glass-tooltip";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ApplicationStatus = "rejected" | "accepted" | "pending";

type StepState = "completed" | "active" | "upcoming";

interface ProgressStep {
  label: string;
  state: StepState;
  icon: "check" | "x-circle" | "check-circle" | "eye" | "loader";
  color?: string; // override color for active icons
  bgColor?: string; // override bg for active icons
  borderColor?: string; // optional border
}

interface Application {
  id: number;
  brandName: string;
  brandAvatar: string; // gradient placeholder
  campaignTitle: string;
  campaignDescription: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusLabel: string;
  statusDate: string;
  creatorCount: string;
  cpmAmount: string;
  cpmUnit: string;
  platforms: ("tiktok" | "instagram")[];
  category: { label: string; icon: "user" | "music" | "swords" };
  progress: ProgressStep[];
  actions: { label: string; primary?: boolean }[];
  gradientColor: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const applications: Application[] = [
  {
    id: 1,
    brandName: "Polymarket Official Clipping",
    brandAvatar: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    campaignTitle: "PolyMarket UGC Reposting Campaign",
    campaignDescription:
      "Post Clips from the provided google drive of UGC content and get paid $0.5 per 1k views",
    appliedDate: "Mon 2 Mar, 2026",
    status: "rejected",
    statusLabel: "Rejected",
    statusDate: "on Wed 4 Mar, 2026",
    creatorCount: "95",
    cpmAmount: "$0.50",
    cpmUnit: "1K",
    platforms: ["tiktok", "instagram"],
    category: { label: "Personal brand", icon: "user" },
    progress: [
      { label: "Submitted", state: "completed", icon: "check" },
      { label: "Reviewed", state: "completed", icon: "check" },
      {
        label: "Rejected",
        state: "active",
        icon: "x-circle",
        bgColor: "#FF2525",
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
      },
    ],
    actions: [
      { label: "Browse similar" },
      { label: "Reapply", primary: true },
    ],
    gradientColor: "rgba(255, 37, 37, 0.07)",
  },
  {
    id: 2,
    brandName: "Scene Society",
    brandAvatar: "linear-gradient(135deg, #f472b6, #ec4899)",
    campaignTitle: "Mumford & Sons | Prizefighter Clipping",
    campaignDescription:
      "Clip content from the approved folder of assets or create your own using the approved formats listed below.",
    appliedDate: "Tue 3 Mar, 2026",
    status: "accepted",
    statusLabel: "Accepted",
    statusDate: "Accepted on Jan. 10, 2026",
    creatorCount: "725",
    cpmAmount: "$1",
    cpmUnit: "1K",
    platforms: ["tiktok", "instagram"],
    category: { label: "Music", icon: "music" },
    progress: [
      { label: "Submitted", state: "completed", icon: "check" },
      { label: "Reviewed", state: "completed", icon: "check" },
      {
        label: "Accepted",
        state: "active",
        icon: "check-circle",
        bgColor: "#00B26E",
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
      },
    ],
    actions: [
      { label: "View campaign" },
      { label: "Submit content", primary: true },
    ],
    gradientColor: "rgba(0, 178, 110, 0.07)",
  },
  {
    id: 3,
    brandName: "Clipping Culture",
    brandAvatar: "linear-gradient(135deg, #fb923c, #f97316)",
    campaignTitle: "Call of Duty BO7 Official Clipping Campaign",
    campaignDescription:
      "We're launching a campaign to promote the new Call of Duty Warzone mode: Black Ops Royale. It is inspired from Call of Duty's first Battle Royale, Blackout.",
    appliedDate: "Wed 4 Mar, 2026",
    status: "pending",
    statusLabel: "Pending",
    statusDate: "Est. wait: 2-3 days",
    creatorCount: "3K",
    cpmAmount: "$1.50",
    cpmUnit: "1K",
    platforms: ["tiktok", "instagram"],
    category: { label: "Gaming", icon: "swords" },
    progress: [
      { label: "Submitted", state: "completed", icon: "check" },
      { label: "Under review", state: "active", icon: "eye" },
      { label: "Decision", state: "upcoming", icon: "loader" },
    ],
    actions: [{ label: "Withdraw" }, { label: "View details" }],
    gradientColor: "rgba(255, 144, 37, 0.07)",
  },
  {
    id: 4,
    brandName: "Sound Network",
    brandAvatar: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    campaignTitle: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    campaignDescription:
      'Post the provided clips of Harry Styles singing "Honey I\'m Home" during the interview to help spotlight the Shania Twain catalog.',
    appliedDate: "Tue 3 Mar, 2026",
    status: "pending",
    statusLabel: "Pending",
    statusDate: "Est. wait: 2-3 days",
    creatorCount: "28",
    cpmAmount: "$2",
    cpmUnit: "1K",
    platforms: ["tiktok"],
    category: { label: "Music", icon: "music" },
    progress: [
      { label: "Submitted", state: "completed", icon: "check" },
      { label: "Reviewed", state: "completed", icon: "check" },
      { label: "Deciding", state: "active", icon: "loader" },
    ],
    actions: [{ label: "Withdraw" }, { label: "View details" }],
    gradientColor: "rgba(255, 144, 37, 0.07)",
  },
];

const tabs = [
  { id: "all", label: "All", count: 8 },
  { id: "rejected", label: "Rejected", count: 1, badge: true },
  { id: "pending", label: "Pending", count: 2 },
  { id: "accepted", label: "Accepted", count: 5 },
];

/* ------------------------------------------------------------------ */
/*  Small Components                                                   */
/* ------------------------------------------------------------------ */

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 0L8.5 1.2L10.3 0.8L11 2.5L12.8 3.2L12.5 5.1L14 6.5L12.8 8L13.2 9.8L11.5 10.5L10.8 12.3L8.9 12L7.5 13.5L6 12.3L4.2 12.7L3.5 11L1.7 10.3L2 8.4L0.5 7L1.7 5.5L1.3 3.7L3 3L3.7 1.2L5.6 1.5L7 0Z"
        fill="url(#gold)"
      />
      <path
        d="M5.5 7.2L6.5 8.2L8.8 5.5"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="gold" x1="7" y1="0" x2="7" y2="14">
          <stop offset="0%" stopColor="#FDDC87" />
          <stop offset="100%" stopColor="#FCB02B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CategoryIcon({
  icon,
  className,
}: {
  icon: "user" | "music" | "swords";
  className?: string;
}) {
  const cn = className || "h-3 w-3";
  if (icon === "user") return <User className={cn} />;
  if (icon === "music") return <Music className={cn} />;
  return <Swords className={cn} />;
}

function StepIcon({
  step,
}: {
  step: ProgressStep;
}) {
  const isCompleted = step.state === "completed";
  const isActive = step.state === "active";

  // Completed steps: gray bg with gray check
  if (isCompleted) {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] dark:bg-white/10">
        <Check className="h-3 w-3 text-black/50 dark:text-white/50" />
      </div>
    );
  }

  // Active/final states with colored bg
  if (isActive && step.bgColor) {
    return (
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: step.bgColor,
          border: step.borderColor
            ? `2px solid ${step.borderColor}`
            : undefined,
          boxShadow: step.borderColor
            ? undefined
            : undefined,
        }}
      >
        {step.icon === "x-circle" && (
          <XCircle
            className="h-3 w-3"
            style={{ color: step.color }}
          />
        )}
        {step.icon === "check-circle" && (
          <CheckCircle
            className="h-3 w-3"
            style={{ color: step.color }}
          />
        )}
      </div>
    );
  }

  // Active step without colored bg (eye, loader)
  if (isActive) {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] dark:bg-white/10">
        {step.icon === "eye" && (
          <Eye className="h-3 w-3 text-black dark:text-white" />
        )}
        {step.icon === "loader" && (
          <Loader2 className="h-3 w-3 text-black dark:text-white" />
        )}
      </div>
    );
  }

  // Upcoming step
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#151515]">
      {step.icon === "loader" && (
        <Loader2 className="h-3 w-3 text-black/50 dark:text-white/50" />
      )}
    </div>
  );
}

const statusColors: Record<
  ApplicationStatus,
  { bg: string; text: string; darkBg: string }
> = {
  rejected: {
    bg: "rgba(255, 37, 37, 0.1)",
    text: "#FF2525",
    darkBg: "rgba(255, 37, 37, 0.15)",
  },
  accepted: {
    bg: "rgba(0, 178, 110, 0.1)",
    text: "#00B36E",
    darkBg: "rgba(0, 178, 110, 0.15)",
  },
  pending: {
    bg: "rgba(255, 144, 37, 0.1)",
    text: "#FF9025",
    darkBg: "rgba(255, 144, 37, 0.15)",
  },
};

const statusIcons: Record<ApplicationStatus, typeof XCircle> = {
  rejected: XCircle,
  accepted: CheckCircle,
  pending: Clock,
};

function ActionButton({
  label,
  primary,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className="glass-hover cursor-pointer rounded-full px-3 py-2 text-xs font-medium tracking-[-0.02em] active:scale-[0.98]"
      style={{
        backgroundColor: primary
          ? "var(--action-primary-bg)"
          : "var(--action-secondary-bg)",
        color: primary
          ? "var(--action-primary-text)"
          : "var(--action-secondary-text)",
      }}
      role="button"
    >
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Application Card                                                   */
/* ------------------------------------------------------------------ */

function ApplicationCard({ app }: { app: Application }) {
  const StatusIcon = statusIcons[app.status];
  const colors = statusColors[app.status];

  return (
    <div className="relative flex w-full overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.06] dark:bg-[#151515] dark:shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          background: `linear-gradient(86.46deg, transparent 87.34%, ${app.gradientColor} 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full gap-4">
        {/* Left: thumbnail + info */}
        <div className="flex min-w-0 flex-1 gap-4">
          {/* Thumbnail */}
          <div className="flex h-[160px] w-[240px] shrink-0 items-center justify-center p-1">
            <div
              className="h-full w-full rounded-2xl"
              style={{ background: app.brandAvatar }}
            />
          </div>

          {/* Campaign info */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-4">
            {/* Top: brand + title */}
            <div className="flex flex-col gap-2.5">
              {/* Brand row */}
              <div className="flex items-center gap-1.5">
                <div
                  className="h-5 w-5 shrink-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                  style={{ background: app.brandAvatar }}
                />
                <span
                  className="truncate text-xs font-medium tracking-[-0.02em]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {app.brandName}
                </span>
                <VerifiedBadge />
                <span
                  className="shrink-0 text-xs tracking-[-0.02em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  ·
                </span>
                <span
                  className="shrink-0 text-xs tracking-[-0.02em]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Applied on {app.appliedDate}
                </span>
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-1">
                <h3
                  className="truncate text-sm font-medium tracking-[-0.02em]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {app.campaignTitle}
                </h3>
                <p
                  className="line-clamp-1 text-sm leading-[150%] tracking-[-0.02em]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {app.campaignDescription}
                </p>
              </div>
            </div>

            {/* Bottom: pills */}
            <div className="flex items-center gap-1.5">
              {/* Creators pill */}
              <div className="flex items-center gap-1.5 rounded-full bg-black/[0.06] px-2.5 py-1.5 dark:bg-white/[0.06]">
                <Users className="h-3 w-3" style={{ color: "var(--text-primary)" }} />
                <span
                  className="text-xs font-medium tracking-[-0.02em]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {app.creatorCount}
                </span>
              </div>

              {/* CPM pill */}
              <div className="flex items-center gap-0.5 rounded-full bg-blue-500/[0.12] px-2.5 py-1.5">
                <span className="text-xs font-medium tracking-[-0.02em] text-blue-500">
                  {app.cpmAmount}
                </span>
                <span className="text-xs tracking-[-0.02em] text-blue-500/70">
                  /
                </span>
                <span className="text-xs tracking-[-0.02em] text-blue-500/70">
                  {app.cpmUnit}
                </span>
              </div>

              <span
                className="text-xs tracking-[-0.02em]"
                style={{ color: "var(--text-muted)" }}
              >
                ·
              </span>

              {/* Platform icons */}
              <div className="flex items-center gap-1">
                {app.platforms.map((p) => (
                  <div
                    key={p}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] backdrop-blur-[12px] dark:bg-white/[0.06]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <PlatformIcon
                      platform={p}
                      size={12}
                    />
                  </div>
                ))}

                {/* Category */}
                <div
                  className="flex items-center gap-1.5 rounded-full bg-black/[0.06] py-1.5 pl-2 pr-2.5 backdrop-blur-[12px] dark:bg-white/[0.06]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CategoryIcon
                    icon={app.category.icon}
                    className="h-3 w-3"
                  />
                  <span
                    className="text-xs font-medium tracking-[-0.02em]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {app.category.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex shrink-0 items-stretch py-4">
          <div className="w-px bg-black/[0.06] dark:bg-white/[0.06]" />
        </div>

        {/* Middle: progress tracker */}
        <div className="flex w-[160px] shrink-0 flex-col justify-between py-4">
          {app.progress.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <StepIcon step={step} />
              <span
                className={`text-xs tracking-[-0.02em] ${
                  step.state === "active" || step.bgColor
                    ? "font-medium"
                    : ""
                }`}
                style={{
                  color:
                    step.state === "active" || step.bgColor
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
              >
                {step.label}
              </span>
              {/* "Why?" link for rejected */}
              {step.icon === "x-circle" && step.state === "active" && (
                <GlassTooltip text="Your account didn't meet the minimum follower requirement of 10K for this campaign. Try applying to campaigns with lower thresholds or grow your audience and reapply.">
                  <span
                    className="cursor-help text-xs font-medium tracking-[-0.02em] underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Why?
                  </span>
                </GlassTooltip>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex shrink-0 items-stretch py-4">
          <div className="w-px bg-black/[0.06] dark:bg-white/[0.06]" />
        </div>

        {/* Right: status + actions */}
        <div className="flex w-[240px] shrink-0 flex-col items-end justify-between py-4 pr-4">
          {/* Status */}
          <div className="flex flex-col items-end gap-2">
            <div
              className="flex items-center gap-1 rounded-full px-2 py-1.5"
              style={{ backgroundColor: colors.bg }}
            >
              <StatusIcon
                className="h-3 w-3"
                style={{ color: colors.text }}
              />
              <span
                className="text-xs font-medium tracking-[-0.02em]"
                style={{ color: colors.text }}
              >
                {app.statusLabel}
              </span>
            </div>
            <span
              className="text-xs tracking-[-0.02em]"
              style={{ color: "var(--text-secondary)" }}
            >
              {app.statusDate}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {app.actions.map((action) => (
              <ActionButton
                key={action.label}
                label={action.label}
                primary={action.primary}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Dropdown                                                    */
/* ------------------------------------------------------------------ */

type FilterSubmenu = "platform" | "category" | "payment" | null;

const sortOptions = [
  { id: "date", label: "Date Applied" },
  { id: "payout", label: "Payout (high to low)" },
  { id: "followers", label: "Follower requirement" },
];

const filterSections: { id: FilterSubmenu & string; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "category", label: "Category" },
  { id: "payment", label: "Payment model" },
];

const platformOptions = [
  { id: "all", label: "All", icon: null },
  { id: "tiktok", label: "TikTok", icon: "tiktok" as const },
  { id: "instagram", label: "Instagram", icon: "instagram" as const },
  { id: "youtube", label: "YouTube", icon: "youtube" as const },
];

const categoryIcons: Record<string, typeof Music> = {
  music: Music,
  gaming: Gamepad2,
  entertainment: Tv,
  sports: Trophy,
  education: GraduationCap,
  lifestyle: Heart,
  technology: Cpu,
};

const categoryOptions = [
  { id: "all", label: "All" },
  { id: "music", label: "Music" },
  { id: "gaming", label: "Gaming" },
  { id: "entertainment", label: "Entertainment" },
  { id: "sports", label: "Sports" },
  { id: "education", label: "Education" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "technology", label: "Technology" },
];

const paymentOptions = [
  { id: "all", label: "All", Icon: null, w: 0, h: 0 },
  { id: "cpm", label: "CPM", Icon: CpmEyeIcon, w: 15, h: 11 },
  { id: "retainer", label: "Retainer", Icon: RetainerIcon, w: 16, h: 16 },
  { id: "per-video", label: "Per post", Icon: PerPostIcon, w: 16, h: 14 },
];

function DropdownRow({
  children,
  active,
  onClick,
  onMouseEnter,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="flex cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 transition-colors hover:bg-black/[0.04] active:bg-black/[0.06] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.06]"
      style={active ? { backgroundColor: "var(--dropdown-active-row)" } : undefined}
      role="button"
    >
      {children}
    </div>
  );
}

function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<FilterSubmenu>(null);
  const [activeSort, setActiveSort] = useState("date");
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePayment, setActivePayment] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [submenuTop, setSubmenuTop] = useState(0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSubmenu(null);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const dropdownStyle = {
    backgroundColor: "var(--dropdown-bg)",
    border: "1px solid var(--dropdown-border)",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.06)",
  };

  // Calculate submenu vertical position to align with the hovered filter row
  const handleFilterHover = (sectionId: FilterSubmenu, e: React.MouseEvent) => {
    setSubmenu(sectionId);
    if (mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      const rowRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSubmenuTop(rowRect.top - mainRect.top);
    }
  };

  // Render submenu content based on active submenu
  const renderSubmenuContent = () => {
    if (submenu === "platform") {
      return (
        <>
          <div className="flex items-center px-2.5 pb-1 pt-2">
            <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-secondary)" }}>
              Platform
            </span>
          </div>
          {platformOptions.map((opt) => (
            <DropdownRow key={opt.id} onClick={() => setActivePlatform(opt.id)} active={activePlatform === opt.id}>
              <div className="flex flex-1 items-center gap-2">
                {opt.icon && <PlatformIcon platform={opt.icon} size={16} style={{ color: "var(--text-primary)" }} />}
                <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>{opt.label}</span>
              </div>
              {activePlatform === opt.id && <Check className="h-3 w-3" style={{ color: "var(--text-primary)" }} />}
            </DropdownRow>
          ))}
        </>
      );
    }
    if (submenu === "category") {
      return (
        <>
          <div className="flex items-center px-2.5 pb-1 pt-2">
            <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-secondary)" }}>
              Category
            </span>
          </div>
          {categoryOptions.map((opt) => {
            const CatIcon = categoryIcons[opt.id];
            return (
              <DropdownRow key={opt.id} onClick={() => setActiveCategory(opt.id)} active={activeCategory === opt.id}>
                <div className="flex flex-1 items-center gap-2">
                  {CatIcon && <CatIcon className="h-4 w-4" style={{ color: "var(--text-primary)" }} />}
                  <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>{opt.label}</span>
                </div>
                {activeCategory === opt.id && <Check className="h-3 w-3" style={{ color: "var(--text-primary)" }} />}
              </DropdownRow>
            );
          })}
        </>
      );
    }
    if (submenu === "payment") {
      return (
        <>
          <div className="flex items-center px-2.5 pb-1 pt-2">
            <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-secondary)" }}>
              Payment model
            </span>
          </div>
          {paymentOptions.map((opt) => (
            <DropdownRow key={opt.id} onClick={() => setActivePayment(opt.id)} active={activePayment === opt.id}>
              <div className="flex flex-1 items-center gap-2">
                {opt.Icon && <opt.Icon width={opt.w} height={opt.h} style={{ color: "var(--text-primary)" }} />}
                <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>{opt.label}</span>
              </div>
              {activePayment === opt.id && <Check className="h-3 w-3" style={{ color: "var(--text-primary)" }} />}
            </DropdownRow>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center rounded-[14px] bg-black/[0.04] p-0.5 dark:bg-white/[0.04]">
        <button
          onClick={() => {
            setOpen(!open);
            setSubmenu(null);
          }}
          className="glass-hover flex h-9 w-9 items-center justify-center rounded-xl active:scale-[0.98]"
        >
          <SlidersHorizontal
            className="h-4 w-4"
            style={{ color: "var(--text-primary)" }}
          />
        </button>
      </div>

      {open && (
        <>
          {/* Submenu — to the left of main dropdown */}
          {submenu && (
            <div
              className="absolute z-50 mt-1 flex w-[256px] flex-col rounded-xl p-1"
              style={{
                ...dropdownStyle,
                top: "100%",
                right: 256 + 8,
              }}
              onMouseEnter={() => setSubmenu(submenu)}
              onMouseLeave={() => setSubmenu(null)}
            >
              {renderSubmenuContent()}
            </div>
          )}

          {/* Main dropdown */}
          <div
            ref={mainRef}
            className="absolute right-0 top-full z-50 mt-1 flex w-[256px] flex-col rounded-xl p-1"
            style={dropdownStyle}
          >
            {/* Sort by label */}
            <div className="flex items-center px-2.5 pb-1 pt-2">
              <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-secondary)" }}>
                Sort by
              </span>
            </div>
            {sortOptions.map((opt) => (
              <DropdownRow
                key={opt.id}
                onClick={() => setActiveSort(opt.id)}
                onMouseEnter={() => setSubmenu(null)}
                active={activeSort === opt.id}
              >
                <span className="flex-1 text-sm tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
                  {opt.label}
                </span>
                {activeSort === opt.id && <Check className="h-3 w-3" style={{ color: "var(--text-primary)" }} />}
              </DropdownRow>
            ))}

            {/* Divider */}
            <div className="px-2.5 py-1">
              <div className="h-px w-full" style={{ backgroundColor: "var(--dropdown-border)" }} />
            </div>

            {/* Filter by label */}
            <div className="flex items-center px-2.5 pb-1 pt-1">
              <span className="text-sm tracking-[-0.02em]" style={{ color: "var(--text-secondary)" }}>
                Filter by
              </span>
            </div>
            {filterSections.map((section) => (
              <DropdownRow
                key={section.id}
                onMouseEnter={() => setSubmenu(section.id as FilterSubmenu)}
                active={submenu === section.id}
              >
                <span className="flex-1 text-sm tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
                  {section.label}
                </span>
                <ChevronRight className="h-3 w-3" style={{ color: "var(--text-secondary)" }} />
              </DropdownRow>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ApplicationsTestPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredApps =
    activeTab === "all"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <style>{`
        :root {
          --action-primary-bg: #252525;
          --action-primary-text: #FFFFFF;
          --action-secondary-bg: rgba(0,0,0,0.06);
          --action-secondary-text: #000000;
          --tab-active-bg: #FFFFFF;
          --tab-active-text: #000000;
          --text-primary: #000000;
          --text-secondary: rgba(0,0,0,0.5);
          --text-tertiary: rgba(0,0,0,0.7);
          --text-muted: rgba(0,0,0,0.2);
          --dropdown-bg: #FFFFFF;
          --dropdown-border: rgba(37,37,37,0.06);
          --dropdown-active-row: rgba(37,37,37,0.04);
        }
        html.dark {
          --action-primary-bg: #FFFFFF;
          --action-primary-text: #000000;
          --action-secondary-bg: rgba(255,255,255,0.06);
          --action-secondary-text: #FFFFFF;
          --tab-active-bg: #252525;
          --tab-active-text: #FFFFFF;
          --text-primary: #FFFFFF;
          --text-secondary: rgba(255,255,255,0.5);
          --text-tertiary: rgba(255,255,255,0.7);
          --text-muted: rgba(255,255,255,0.2);
          --dropdown-bg: #1a1a1a;
          --dropdown-border: rgba(255,255,255,0.06);
          --dropdown-active-row: rgba(255,255,255,0.04);
        }
      `}</style>
      <ThemeDebugMenu />

      <div className="relative z-10 flex w-full max-w-[1240px] flex-col gap-4 px-5 py-5">
        {/* Filter row */}
        <div className="flex items-start justify-between gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-0.5 rounded-[14px] bg-black/[0.04] p-0.5 dark:bg-white/[0.04]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`glass-hover flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium tracking-[-0.02em] active:scale-[0.98] ${
                  activeTab === tab.id
                    ? "shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                    : ""
                }`}
                style={
                  activeTab === tab.id
                    ? {
                        backgroundColor: "var(--tab-active-bg)",
                        color: "var(--tab-active-text)",
                      }
                    : { color: "var(--text-tertiary)" }
                }
              >
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#FF2525] px-1 text-[10px] font-semibold leading-none tracking-[-0.02em] text-white">
                    {tab.count}
                  </span>
                ) : (
                  <span
                    className="text-sm font-normal tracking-[-0.02em]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter dropdown */}
          <FilterDropdown />
        </div>

        {/* Application cards */}
        <div className="flex flex-col gap-2">
          {filteredApps.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
