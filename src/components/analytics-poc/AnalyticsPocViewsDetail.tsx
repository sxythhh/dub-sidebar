"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_SURFACE_STYLE,
} from "./AnalyticsPocCardPrimitives";
import {
  FluidTable,
  FluidTableHeader,
  FluidTableBody,
  FluidTableRow,
  FluidTableHead,
  FluidTableCell,
} from "./AnalyticsPocFluidTable";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  AnalyticsPocPlatformIcon,
  hasAnalyticsPocPlatformIcon,
  ANALYTICS_POC_PLATFORM_LABELS,
} from "./AnalyticsPocPlatformIcon";
import type { AnalyticsPocPlatform } from "./types";

export interface AnalyticsPocViewsDetailRow {
  id: string;
  creator: string;
  handle: string;
  avatar?: string;
  platform: AnalyticsPocPlatform;
  views: string;
  engagement: string;
}

interface AnalyticsPocViewsDetailProps {
  rows: AnalyticsPocViewsDetailRow[];
  onBack: () => void;
  className?: string;
}

export function AnalyticsPocViewsDetail({
  rows,
  onBack,
  className,
}: AnalyticsPocViewsDetailProps) {
  const totalViews = rows.reduce((sum, row) => {
    const num = Number.parseFloat(row.views.replace(/[^0-9.]/g, ""));
    const multiplier = row.views.includes("M")
      ? 1_000_000
      : row.views.includes("K")
        ? 1_000
        : 1;
    return sum + num * multiplier;
  }, 0);

  const formattedTotal =
    totalViews >= 1_000_000
      ? `${(totalViews / 1_000_000).toFixed(2)}M`
      : totalViews >= 1_000
        ? `${(totalViews / 1_000).toFixed(1)}K`
        : totalViews.toLocaleString();

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div
        className="flex items-center gap-3 rounded-[14px] p-4"
        style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      >
        <button
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[var(--ap-text-secondary)] transition-colors hover:bg-[var(--ap-hover)] hover:text-[var(--ap-text-strong)]"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft className="size-[18px]" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-inter text-[15px] font-semibold leading-[1.2] tracking-[-0.12px] text-[var(--ap-text)]">
            Total Views
          </span>
          <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
            {formattedTotal} views across {rows.length} creators
          </span>
        </div>
      </div>

      {/* Table */}
      <AnalyticsPocPanel padding="none">
        <div className="px-4 pt-4 pb-2">
          <span className="font-inter text-[14px] font-semibold leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
            Views by Creator
          </span>
        </div>

        <div className="px-4 pb-4">
          <FluidTable>
            <FluidTableHeader>
              <FluidTableRow>
                <FluidTableHead className="w-[40px]">#</FluidTableHead>
                <FluidTableHead>Creator</FluidTableHead>
                <FluidTableHead className="w-[120px]">Platform</FluidTableHead>
                <FluidTableHead className="w-[100px] text-right">Views</FluidTableHead>
                <FluidTableHead className="w-[100px] text-right">Engagement</FluidTableHead>
              </FluidTableRow>
            </FluidTableHeader>
            <FluidTableBody>
              {rows.map((row, i) => (
                <FluidTableRow key={row.id} index={i}>
                  <FluidTableCell className="text-[var(--ap-text-tertiary)]">
                    {i + 1}
                  </FluidTableCell>
                  <FluidTableCell>
                    <div className="flex items-center gap-2.5">
                      {row.avatar ? (
                        <Image
                          alt={row.creator}
                          className="size-7 shrink-0 rounded-full object-cover"
                          height={28}
                          src={row.avatar}
                          width={28}
                        />
                      ) : (
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--ap-hover)] font-inter text-[11px] font-medium text-[var(--ap-text-secondary)]">
                          {row.creator.charAt(0)}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--ap-text)] group-[.is-active]/row:text-[var(--ap-text)]">
                          {row.creator}
                        </span>
                        <span className="text-[12px] text-[var(--ap-text-tertiary)]">
                          {row.handle}
                        </span>
                      </div>
                    </div>
                  </FluidTableCell>
                  <FluidTableCell>
                    <span className="inline-flex items-center gap-1 text-[var(--ap-text-strong)]">
                      {hasAnalyticsPocPlatformIcon(row.platform) ? (
                        <AnalyticsPocPlatformIcon
                          className="text-[var(--ap-text-strong)]"
                          platform={row.platform}
                          size={16}
                          tone="inherit"
                        />
                      ) : null}
                      {ANALYTICS_POC_PLATFORM_LABELS[row.platform] ?? row.platform}
                    </span>
                  </FluidTableCell>
                  <FluidTableCell className="text-right font-semibold text-[var(--ap-text)] group-[.is-active]/row:text-[var(--ap-text)]">
                    {row.views}
                  </FluidTableCell>
                  <FluidTableCell className="text-right text-[var(--ap-text-strong)]">
                    {row.engagement}
                  </FluidTableCell>
                </FluidTableRow>
              ))}
            </FluidTableBody>
          </FluidTable>
        </div>
      </AnalyticsPocPanel>
    </div>
  );
}
