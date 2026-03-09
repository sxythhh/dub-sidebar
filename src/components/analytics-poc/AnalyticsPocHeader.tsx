import { cn } from "@/lib/utils";
import type { AnalyticsPocHeaderProps } from "./types";

function QuestionMarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5.33 6.67L8 4l2.67 2.67M8 4v6.67M3.33 10.67v1.33a1.33 1.33 0 001.34 1.33h6.66a1.33 1.33 0 001.34-1.33v-1.33"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AnalyticsPocHeader({
  title,
  className,
}: AnalyticsPocHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between gap-2 border-b border-foreground/[0.06] px-5 py-4 dark:border-foreground/[0.08]",
        className,
      )}
    >
      {/* Title */}
      <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">
        {title}
      </span>

      {/* Right actions */}
      <div className="flex items-start gap-2">
        {/* Search/help pill */}
        <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 pr-3.5 text-page-text-muted transition-colors hover:bg-foreground/[0.04]">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-none tracking-[-0.02em]">
            Monitor performance, creator activity, and payouts
          </span>
          <QuestionMarkIcon />
        </button>

        {/* Export button */}
        <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-4 pr-3.5 text-page-text transition-colors hover:bg-foreground/[0.1]">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-none tracking-[-0.02em]">
            Export
          </span>
          <ExportIcon />
        </button>
      </div>
    </header>
  );
}
