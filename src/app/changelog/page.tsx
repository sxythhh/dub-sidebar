"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "motion/react";
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
  { label: string; color: string; bg: string; icon: typeof Sparkles }
> = {
  feature: {
    label: "Feature",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: Sparkles,
  },
  improvement: {
    label: "Improvement",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: Zap,
  },
  fix: {
    label: "Fix",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: Bug,
  },
  security: {
    label: "Security",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
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
      {
        text: "Improved scroll behavior for article navigation",
        type: "fix",
      },
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
      {
        text: "Faster data loading with query optimization",
        type: "improvement",
      },
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
      {
        text: "Auto-detect browser language preference",
        type: "improvement",
      },
      {
        text: "Translated documentation for all supported languages",
        type: "feature",
      },
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
      {
        text: "New design system with dark and light modes",
        type: "feature",
      },
      {
        text: "Rebuilt navigation with floating footer",
        type: "improvement",
      },
      { text: "Improved mobile responsiveness", type: "improvement" },
      {
        text: "Accessibility improvements (WCAG 2.1 AA)",
        type: "improvement",
      },
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

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-foreground"
      style={{ scaleX }}
    />
  );
}

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });
  const height = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
    { stiffness: 100, damping: 30 },
  );

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-[23px] top-0 w-[2px] md:left-1/2 md:-translate-x-px"
    >
      <div className="absolute inset-0 bg-border" />
      <motion.div
        className="absolute left-0 right-0 top-0 bg-gradient-to-b from-foreground via-foreground/60 to-foreground/20"
        style={{ height }}
      />
    </div>
  );
}

function ChangelogEntry({
  entry,
  index,
}: {
  entry: ChangeEntry;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;
  const typeConfig = TYPE_CONFIG[entry.type];

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <motion.div
        className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] ${
          isLeft ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"
        }`}
        initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.15,
        }}
      >
        <div className="group relative rounded-xl border border-border bg-card-bg p-6 transition-colors duration-300 hover:border-border">
          <div className="mb-3 flex items-center gap-3">
            <motion.span
              className="rounded-md bg-accent px-2.5 py-1 font-[family-name:var(--font-inter)] text-xs font-bold tracking-[-0.02em] text-page-text"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            >
              v{entry.version}
            </motion.span>
            <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
              {entry.date}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wider ${typeConfig.bg} ${typeConfig.color}`}
            >
              {typeConfig.label}
            </span>
          </div>

          <h3 className="mb-2 font-[family-name:var(--font-inter)] text-lg font-semibold tracking-[-0.02em] text-page-text">
            {entry.title}
          </h3>
          <p className="mb-4 font-[family-name:var(--font-inter)] text-sm leading-relaxed tracking-[-0.02em] text-page-text-muted">
            {entry.description}
          </p>

          <ul className="space-y-2">
            {entry.changes.map((change, i) => {
              const changeConfig = TYPE_CONFIG[change.type];
              const ChangeIcon = changeConfig.icon;
              return (
                <motion.li
                  key={i}
                  className="flex items-start gap-2.5 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text-subtle"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.3 }}
                >
                  <ChangeIcon
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${changeConfig.color}`}
                  />
                  {change.text}
                </motion.li>
              );
            })}
          </ul>

          <div
            className={`absolute top-7 hidden h-3 w-3 rotate-45 border bg-card-bg md:block ${
              isLeft
                ? "right-[-7px] border-r border-t border-border group-hover:border-border"
                : "left-[-7px] border-b border-l border-border group-hover:border-border"
            } transition-colors duration-300`}
          />
        </div>
      </motion.div>
    </div>
  );
}

function YearMarker({ year }: { year: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative my-12 flex justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative z-10 rounded-full border border-border bg-page-bg px-5 py-2">
        <span className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-wide text-page-text">
          {year}
        </span>
      </div>
    </motion.div>
  );
}

export default function Page() {
  const entriesWithMarkers: (
    | { kind: "year"; year: string }
    | { kind: "entry"; entry: ChangeEntry; index: number }
  )[] = [];
  let lastYear = "";
  CHANGELOG.forEach((entry, index) => {
    const year = entry.date.split(" ").pop() || "";
    if (year !== lastYear) {
      entriesWithMarkers.push({ kind: "year", year });
      lastYear = year;
    }
    entriesWithMarkers.push({ kind: "entry", entry, index });
  });

  return (
    <div className="min-h-full bg-page-bg">
      <ScrollProgress />

      {/* Header */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Changelog
        </span>
      </div>

      {/* Hero */}
      <div className="px-4 pb-8 pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-[family-name:var(--font-inter)] text-4xl font-bold tracking-tight text-page-text sm:text-5xl">
              Changelog
            </h1>
            <p className="mt-4 font-[family-name:var(--font-inter)] text-lg tracking-[-0.02em] text-page-text-muted">
              New updates and improvements to the platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-4xl px-4 pb-32">
        <TimelineLine />

        <div className="space-y-12">
          {entriesWithMarkers.map((item, i) => {
            if (item.kind === "year") {
              return <YearMarker key={`year-${item.year}`} year={item.year} />;
            }
            return (
              <ChangelogEntry
                key={item.entry.version}
                entry={item.entry}
                index={item.index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
