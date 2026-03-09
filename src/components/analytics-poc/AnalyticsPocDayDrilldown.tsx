"use client";

import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  ANALYTICS_POC_PLATFORM_LABELS,
  AnalyticsPocPlatformIcon,
  getAnalyticsPocPlatformBrandColor,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import { AnalyticsPocProgressBarRow } from "./AnalyticsPocProgressBarRow";
import {
  AnalyticsPocTable,
  type AnalyticsPocTableColumn,
} from "./AnalyticsPocTable";
import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "./AnalyticsPocToggleGroup";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocRankListItem } from "./types";

// ---------- Types ----------

export interface AnalyticsPocDaySubmission {
  id: string;
  creator: string;
  platform: string;
  views: number;
  engagement: number;
  payout: number;
  status: "approved" | "pending" | "rejected";
}

export interface AnalyticsPocDayDrilldownData {
  date: string;
  submissions: AnalyticsPocDaySubmission[];
}

interface AnalyticsPocDayDrilldownProps {
  data: AnalyticsPocDayDrilldownData;
  onBack: () => void;
  className?: string;
}

// ---------- Helpers ----------

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("en-US");
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

const PLACEHOLDER_COLORS = [
  "#E57373",
  "#81C784",
  "#64B5F6",
  "#FFB74D",
  "#BA68C8",
  "#4DB6AC",
  "#FF8A65",
  "#A1887F",
  "#90A4AE",
  "#F06292",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------- Sub-components ----------

function CreatorAvatar({ name }: { name: string }) {
  const bg = getAvatarColor(name);
  const initials = getInitials(name);
  return (
    <span
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full font-inter text-[10px] font-semibold leading-none text-white"
      style={{ backgroundColor: bg }}
    >
      {initials}
    </span>
  );
}

type ChartMetric = "views" | "submissions";

// ---------- Main component ----------

export function AnalyticsPocDayDrilldown({
  data,
  onBack,
  className,
}: AnalyticsPocDayDrilldownProps) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("views");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("views");

  const { submissions } = data;

  // KPI aggregations
  const totalVideos = submissions.length;

  // Aggregate by creator
  const creatorRows = useMemo(() => {
    const map = new Map<
      string,
      { creator: string; views: number; submissions: number; platform: string }
    >();
    for (const sub of submissions) {
      const existing = map.get(sub.creator);
      if (existing) {
        existing.views += sub.views;
        existing.submissions += 1;
      } else {
        map.set(sub.creator, {
          creator: sub.creator,
          platform: sub.platform,
          submissions: 1,
          views: sub.views,
        });
      }
    }
    return [...map.values()].sort((a, b) => b[chartMetric] - a[chartMetric]);
  }, [submissions, chartMetric]);

  // Build progress bar items
  const maxValue = creatorRows[0]?.[chartMetric] ?? 1;
  const progressItems: AnalyticsPocRankListItem[] = useMemo(
    () =>
      creatorRows.map((row, i) => {
        const value = row[chartMetric];
        const progress = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const accentColor =
          getAnalyticsPocPlatformBrandColor(row.platform) ?? "#4D81EE";
        return {
          accentColor,
          icon: <CreatorAvatar name={row.creator} />,
          id: `creator-${i}`,
          label: row.creator,
          percentLabel:
            chartMetric === "views"
              ? (ANALYTICS_POC_PLATFORM_LABELS[row.platform] ?? row.platform)
              : `${row.submissions} vid${row.submissions !== 1 ? "s" : ""}`,
          progress,
          valueLabel:
            chartMetric === "views" ? formatCompact(value) : String(value),
        };
      }),
    [creatorRows, chartMetric, maxValue],
  );

  // Table columns
  const columns: AnalyticsPocTableColumn<AnalyticsPocDaySubmission>[] = useMemo(
    () => [
      {
        header: "#",
        id: "rank",
        renderCell: (_row, ctx) => (
          <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-tertiary)]">
            {ctx.absoluteIndex + 1}
          </span>
        ),
        width: "w-[40px]",
      },
      {
        header: "Creator",
        id: "creator",
        renderCell: (row) => (
          <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
            {row.creator}
          </span>
        ),
      },
      {
        header: "Platform",
        id: "platform",
        renderCell: (row) => {
          const normalized = row.platform.toLowerCase();
          return (
            <span className="inline-flex items-center gap-1 font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]">
              {hasAnalyticsPocPlatformIcon(normalized) ? (
                <AnalyticsPocPlatformIcon
                  className="text-[var(--ap-text-strong)]"
                  platform={normalized}
                  size={16}
                  tone="inherit"
                />
              ) : (
                <span className="size-1.5 rounded-full bg-[var(--ap-text-secondary)]" />
              )}
              {ANALYTICS_POC_PLATFORM_LABELS[normalized] ?? row.platform}
            </span>
          );
        },
        width: "w-[120px]",
      },
      {
        getSortValue: (row) => row.views,
        header: "Views",
        id: "views",
        renderCell: (row) => (
          <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
            {formatCompact(row.views)}
          </span>
        ),
        sortable: true,
        width: "w-[96px]",
      },
      {
        getSortValue: (row) => row.engagement,
        header: "Eng.",
        id: "engagement",
        renderCell: (row) => (
          <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]">
            {formatPercent(row.engagement)}
          </span>
        ),
        sortable: true,
        width: "w-[96px]",
      },
      {
        getSortValue: (row) => row.payout,
        header: "Payout",
        id: "payout",
        renderCell: (row) => (
          <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]">
            {formatCurrency(row.payout)}
          </span>
        ),
        sortable: true,
        width: "w-[120px]",
      },
    ],
    [],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-[14px] p-4",
          ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        )}
        style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      >
        <button
          className={cn(
            ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
            "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[var(--ap-text-secondary)] transition-colors duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)] hover:bg-[var(--ap-hover)] hover:text-[var(--ap-text-strong)]",
          )}
          onClick={onBack}
          type="button"
        >
          <ChevronLeft className="size-[18px]" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-inter text-[15px] font-semibold leading-[1.2] tracking-[-0.12px] text-[var(--ap-text)]">
              {data.date}
            </span>
            <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-tertiary)]">
              ·
            </span>
            <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
              {totalVideos} submission{totalVideos !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Creator breakdown — progress bar rows */}
      <AnalyticsPocPanel>
        <AnalyticsPocToggleGroup
          onValueChange={(v) => setChartMetric(v as ChartMetric)}
          value={chartMetric}
        >
          <AnalyticsPocToggleGroupItem value="views">
            Views
          </AnalyticsPocToggleGroupItem>
          <AnalyticsPocToggleGroupItem value="submissions">
            Submissions
          </AnalyticsPocToggleGroupItem>
        </AnalyticsPocToggleGroup>
        <div className="group/progress-card mt-3 space-y-1">
          {progressItems.map((item) => (
            <AnalyticsPocProgressBarRow item={item} key={item.id} />
          ))}
        </div>
      </AnalyticsPocPanel>

      {/* All Submissions table */}
      <AnalyticsPocPanel padding="none">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="font-inter text-[14px] font-semibold leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
            All Submissions
          </span>
          <span className="font-inter text-[12px] font-normal text-[var(--ap-text-secondary)]">
            {totalVideos} total
          </span>
        </div>
        <AnalyticsPocTable
          columns={columns}
          emptyMessage="No submissions"
          onPageChange={setPage}
          onSortKeyChange={(nextKey) => {
            if (nextKey === sortKey) {
              setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
            } else {
              setSortKey(nextKey);
              setSortDirection("desc");
            }
            setPage(1);
          }}
          page={page}
          pageSize={10}
          rowKey={(row) => row.id}
          rows={submissions}
          sortDirection={sortDirection}
          sortKey={sortKey}
        />
      </AnalyticsPocPanel>
    </div>
  );
}
