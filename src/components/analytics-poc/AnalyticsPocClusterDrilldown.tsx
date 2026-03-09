"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_CARD_SURFACE_STYLE } from "./AnalyticsPocCardPrimitives";
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

export interface AnalyticsPocClusterVideo {
  id: string;
  title: string;
  creator: string;
  avatar?: string;
  platform: AnalyticsPocPlatform;
  views: string;
  engagement: string;
}

export interface AnalyticsPocClusterDrilldownData {
  clusterId: string;
  clusterLabel: string;
  accentColor: string;
  videoCount: string;
  totalViews: string;
  videos: AnalyticsPocClusterVideo[];
}

interface AnalyticsPocClusterDrilldownProps {
  data: AnalyticsPocClusterDrilldownData;
  onBack: () => void;
  className?: string;
}

export function AnalyticsPocClusterDrilldown({
  data,
  onBack,
  className,
}: AnalyticsPocClusterDrilldownProps) {
  return (
    <div className={cn("space-y-3", className)}>
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

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: data.accentColor }}
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-inter text-[15px] font-semibold leading-[1.2] tracking-[-0.12px] text-[var(--ap-text)]">
              {data.clusterLabel}
            </span>
            <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
              {data.videoCount} videos · {data.totalViews} views
            </span>
          </div>
        </div>
      </div>

      <AnalyticsPocPanel padding="none">
        <div className="px-4 pt-4 pb-2">
          <span className="font-inter text-[14px] font-semibold leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
            Top Videos
          </span>
        </div>

        <div className="px-4 pb-4">
          <FluidTable>
            <FluidTableHeader>
              <FluidTableRow>
                <FluidTableHead className="w-[40px]">#</FluidTableHead>
                <FluidTableHead>Video</FluidTableHead>
                <FluidTableHead className="w-[120px]">Platform</FluidTableHead>
                <FluidTableHead className="w-[100px] text-right">
                  Views
                </FluidTableHead>
                <FluidTableHead className="w-[100px] text-right">
                  Engagement
                </FluidTableHead>
              </FluidTableRow>
            </FluidTableHeader>
            <FluidTableBody>
              {data.videos.map((video, i) => (
                <FluidTableRow key={video.id} index={i}>
                  <FluidTableCell className="text-[var(--ap-text-tertiary)]">
                    {i + 1}
                  </FluidTableCell>
                  <FluidTableCell>
                    <div className="flex items-center gap-2.5">
                      {video.avatar ? (
                        <Image
                          alt={video.creator}
                          className="size-7 shrink-0 rounded-full object-cover"
                          height={28}
                          src={video.avatar}
                          width={28}
                        />
                      ) : (
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--ap-hover)] font-inter text-[11px] font-medium text-[var(--ap-text-secondary)]">
                          {video.creator.charAt(0)}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--ap-text)] group-[.is-active]/row:text-[var(--ap-text)]">
                          {video.title}
                        </span>
                        <span className="text-[12px] text-[var(--ap-text-tertiary)]">
                          {video.creator}
                        </span>
                      </div>
                    </div>
                  </FluidTableCell>
                  <FluidTableCell>
                    <span className="inline-flex items-center gap-1 text-[var(--ap-text-strong)]">
                      {hasAnalyticsPocPlatformIcon(video.platform) ? (
                        <AnalyticsPocPlatformIcon
                          className="text-[var(--ap-text-strong)]"
                          platform={video.platform}
                          size={16}
                          tone="inherit"
                        />
                      ) : null}
                      {ANALYTICS_POC_PLATFORM_LABELS[video.platform] ??
                        video.platform}
                    </span>
                  </FluidTableCell>
                  <FluidTableCell className="text-right font-semibold text-[var(--ap-text)] group-[.is-active]/row:text-[var(--ap-text)]">
                    {video.views}
                  </FluidTableCell>
                  <FluidTableCell className="text-right text-[var(--ap-text-strong)]">
                    {video.engagement}
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
