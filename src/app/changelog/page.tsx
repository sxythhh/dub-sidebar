"use client";

import { useRef, useState, useCallback } from "react";
import { Sparkles, Zap, Shield, Bug } from "lucide-react";

type ChangeType = "feature" | "improvement" | "fix" | "security";

interface ChangeEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangeType;
  changes: { text: string; type: ChangeType }[];
}

const TYPE_CONFIG: Record<
  ChangeType,
  { label: string; color: string; bg: string; dotColor: string; icon: typeof Sparkles }
> = {
  feature: {
    label: "Feature",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    dotColor: "bg-emerald-500",
    icon: Sparkles,
  },
  improvement: {
    label: "Improvement",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",
    dotColor: "bg-blue-500",
    icon: Zap,
  },
  fix: {
    label: "Fix",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
    dotColor: "bg-amber-500",
    icon: Bug,
  },
  security: {
    label: "Security",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20",
    dotColor: "bg-red-500",
    icon: Shield,
  },
};

const CHANGELOG: ChangeEntry[] = [
  {
    version: "2.4.0",
    date: "March 2026",
    title: "Inline Documentation Editing",
    description:
      "Admin users can now edit documentation directly on the public pages without switching to the admin panel.",
    type: "feature",
    changes: [
      { text: "Inline section editing for docs pages", type: "feature" },
      { text: "Rich markdown editor with live preview", type: "feature" },
      { text: "Improved scroll behavior for article navigation", type: "fix" },
      { text: "Better scroll-to-top on article changes", type: "fix" },
    ],
  },
  {
    version: "2.3.0",
    date: "February 2026",
    title: "Advanced Analytics Dashboard",
    description:
      "Completely rebuilt analytics with real-time metrics, custom date ranges, and exportable reports.",
    type: "feature",
    changes: [
      { text: "Real-time campaign performance metrics", type: "feature" },
      { text: "Custom date range selector", type: "feature" },
      { text: "Export reports as CSV and PDF", type: "feature" },
      { text: "Faster data loading with query optimization", type: "improvement" },
    ],
  },
  {
    version: "2.2.0",
    date: "January 2026",
    title: "Creator Discovery Overhaul",
    description:
      "New filtering system and creator profiles make it easier than ever to find the perfect creators for your campaigns.",
    type: "improvement",
    changes: [
      { text: "Advanced creator search with filters", type: "feature" },
      { text: "Creator portfolio pages", type: "feature" },
      { text: "Audience demographics breakdown", type: "improvement" },
      { text: "Performance score algorithm update", type: "improvement" },
    ],
  },
  {
    version: "2.1.0",
    date: "December 2025",
    title: "Multi-language Support",
    description:
      "Full internationalization across 11 languages including German, French, Spanish, Portuguese, Chinese, and more.",
    type: "feature",
    changes: [
      { text: "Support for 11 languages", type: "feature" },
      { text: "Auto-detect browser language preference", type: "improvement" },
      { text: "Translated documentation for all supported languages", type: "feature" },
      { text: "RTL layout preparation", type: "improvement" },
    ],
  },
  {
    version: "2.0.0",
    date: "November 2025",
    title: "Platform Redesign",
    description:
      "A complete visual overhaul with a new design system, dark mode, and improved navigation across all pages.",
    type: "improvement",
    changes: [
      { text: "New design system with dark and light modes", type: "feature" },
      { text: "Rebuilt navigation with floating footer", type: "improvement" },
      { text: "Improved mobile responsiveness", type: "improvement" },
      { text: "Accessibility improvements (WCAG 2.1 AA)", type: "improvement" },
      { text: "SOC 2 compliance audit completed", type: "security" },
    ],
  },
  {
    version: "1.5.0",
    date: "October 2025",
    title: "Campaign Automation",
    description:
      "Set up automated workflows for campaign approvals, payments, and content review to save hours of manual work.",
    type: "feature",
    changes: [
      { text: "Automated content approval workflows", type: "feature" },
      { text: "Scheduled payment processing", type: "feature" },
      { text: "Campaign status webhooks", type: "feature" },
      { text: "Fixed duplicate notification bug", type: "fix" },
    ],
  },
  {
    version: "1.4.0",
    date: "September 2025",
    title: "Enhanced Security",
    description:
      "Major security update including two-factor authentication, session management, and improved encryption.",
    type: "security",
    changes: [
      { text: "Two-factor authentication (TOTP)", type: "security" },
      { text: "Session management dashboard", type: "security" },
      { text: "Upgraded to TLS 1.3", type: "security" },
      { text: "API rate limiting improvements", type: "security" },
    ],
  },
  {
    version: "1.3.0",
    date: "August 2025",
    title: "Brand Dashboard",
    description:
      "A dedicated dashboard for brands to manage campaigns, track spending, and monitor creator performance.",
    type: "feature",
    changes: [
      { text: "Brand-specific dashboard with KPIs", type: "feature" },
      { text: "Campaign budget tracking", type: "feature" },
      { text: "Creator performance comparisons", type: "improvement" },
      { text: "Fixed timezone display issues", type: "fix" },
    ],
  },
];

function ChangelogEntry({ entry }: { entry: ChangeEntry }) {
  const typeConfig = TYPE_CONFIG[entry.type];

  return (
    <div
      id={`v${entry.version}`}
      className="scroll-mt-16"
    >
      <div className="rounded-xl border border-border bg-card-bg px-5 py-4">
        {/* Version + date + badge row */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold tracking-[-0.02em] text-page-text">
            v{entry.version}
          </span>
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">
            {entry.date}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeConfig.bg} ${typeConfig.color}`}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1.5 text-[15px] font-semibold tracking-[-0.02em] text-page-text">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="mb-3 text-sm leading-relaxed tracking-[-0.02em] text-page-text-muted">
          {entry.description}
        </p>

        {/* Changes */}
        <ul className="space-y-1.5">
          {entry.changes.map((change, i) => {
            const changeConfig = TYPE_CONFIG[change.type];
            const ChangeIcon = changeConfig.icon;
            return (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] tracking-[-0.02em] text-page-text-subtle"
              >
                <ChangeIcon
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${changeConfig.color}`}
                />
                {change.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function YearDivider({ year }: { year: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-page-text-muted">
        {year}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export default function Page() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeVersion, setActiveVersion] = useState(CHANGELOG[0].version);

  // Find the scroll container (the overflow-y-auto parent from main-nav)
  const setScrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Walk up to find the scrollable parent
      let el: HTMLElement | null = node;
      while (el) {
        const style = getComputedStyle(el);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          scrollContainerRef.current = el as HTMLDivElement;
          break;
        }
        el = el.parentElement;
      }
    }
  }, []);

  const scrollToVersion = useCallback((version: string) => {
    const target = document.getElementById(`v${version}`);
    if (!target) return;

    setActiveVersion(version);

    const container = scrollContainerRef.current;
    if (container) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = targetRect.top - containerRect.top + container.scrollTop - 64; // 64px for sticky header
      container.scrollTo({ top: offset, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Group entries by year for the TOC
  const years = new Map<string, ChangeEntry[]>();
  CHANGELOG.forEach((entry) => {
    const year = entry.date.split(" ").pop() || "";
    if (!years.has(year)) years.set(year, []);
    years.get(year)!.push(entry);
  });

  // Build timeline items
  const entriesWithDividers: (
    | { kind: "year"; year: string }
    | { kind: "entry"; entry: ChangeEntry }
  )[] = [];
  let lastYear = "";
  CHANGELOG.forEach((entry) => {
    const year = entry.date.split(" ").pop() || "";
    if (year !== lastYear) {
      entriesWithDividers.push({ kind: "year", year });
      lastYear = year;
    }
    entriesWithDividers.push({ kind: "entry", entry });
  });

  return (
    <div ref={setScrollRef} className="min-h-full bg-page-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Changelog
        </span>
      </div>

      {/* Hero + TOC */}
      <div className="mx-auto max-w-xl px-6 pb-8 pt-16 text-center sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-page-text sm:text-4xl">
          <span className="font-bold">NEW</span>
        </h1>
        <p className="mt-3 text-sm tracking-[-0.02em] text-page-text-muted">
          Updates and improvements to the platform.
        </p>

        {/* Version pills — clickable TOC */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CHANGELOG.map((entry, i) => {
            const isActive = activeVersion === entry.version;
            return (
              <button
                key={entry.version}
                onClick={() => scrollToVersion(entry.version)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                  isActive
                    ? "border-foreground/20 bg-foreground text-white dark:border-foreground/40"
                    : "border-border bg-card-bg text-page-text-muted hover:border-foreground/20 hover:text-page-text"
                }`}
              >
                v{entry.version}
                {i === 0 && (
                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
                    latest
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entries — single centered column */}
      <div className="mx-auto max-w-xl space-y-3 px-6 pb-32 sm:px-8">
        {entriesWithDividers.map((item) => {
          if (item.kind === "year") {
            return <YearDivider key={`year-${item.year}`} year={item.year} />;
          }
          return (
            <ChangelogEntry
              key={item.entry.version}
              entry={item.entry}
            />
          );
        })}
      </div>
    </div>
  );
}
