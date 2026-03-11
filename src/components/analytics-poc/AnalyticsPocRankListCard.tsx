"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import { AnalyticsPocProgressBarRow } from "./AnalyticsPocProgressBarRow";
import type {
  AnalyticsPocRankHeaderIcon,
  AnalyticsPocRankListCardProps,
  AnalyticsPocRankListItem,
} from "./types";

const RANK_HEADER_ICON_SOURCE: Record<AnalyticsPocRankHeaderIcon, string> = {
  "content-clusters": "/icons/svg/analytics-content-clusters-header.svg",
  "effective-cpm": "/icons/svg/analytics-effective-cpm-header.svg",
  "engagement-rate": "/icons/svg/analytics-engagement-rate-header.svg",
  posts: "/icons/svg/analytics-posts-header.svg",
  views: "/icons/svg/analytics-views-header.svg",
};

const BAR_STAGGER = 0.04;
const BAR_DURATION = 0.3;
const BAR_EASE = [0.25, 0.1, 0.25, 1] as const;
const HEADER_TRANSITION = { duration: 0.18, ease: BAR_EASE };

function StaggeredBarList({
  items,
  onItemClick,
  direction,
}: {
  items: AnalyticsPocRankListItem[];
  onItemClick?: (id: string) => void;
  direction: 1 | -1;
}) {
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: BAR_DURATION,
            delay: i * BAR_STAGGER,
            ease: BAR_EASE,
          }}
        >
          <AnalyticsPocProgressBarRow
            item={item}
            onClick={onItemClick ? () => onItemClick(item.id) : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function AnalyticsPocRankListCard({
  title,
  headerIcon,
  infoTooltipText,
  items,
  drilldowns,
  onItemClick,
  className,
}: AnalyticsPocRankListCardProps & { onItemClick?: (itemId: string) => void }) {
  const iconSrc = RANK_HEADER_ICON_SOURCE[headerIcon];
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const activeDrilldown =
    activeClusterId && drilldowns ? drilldowns[activeClusterId] : null;

  const handleItemClick = (itemId: string) => {
    if (drilldowns?.[itemId]) {
      directionRef.current = 1;
      setActiveClusterId(itemId);
    }
    onItemClick?.(itemId);
  };

  const handleBack = () => {
    directionRef.current = -1;
    setActiveClusterId(null);
  };

  const isClickable = Boolean(drilldowns) || Boolean(onItemClick);

  return (
    <AnalyticsPocPanel className={cn(className)}>
      {/* Header */}
      <AnimatePresence mode="wait" initial={false}>
        {activeDrilldown ? (
          <motion.div
            key={activeClusterId}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={HEADER_TRANSITION}
            className="flex items-center gap-[6px] pb-4"
          >
            <button
              className="mr-0.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--ap-text-tertiary)] transition-colors hover:text-[var(--ap-text-strong)]"
              onClick={handleBack}
              type="button"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: activeDrilldown.accentColor }}
            />
            <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-heading)]">
              {activeDrilldown.label}
            </span>
            <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-tertiary)]">
              Top {activeDrilldown.items.length}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="root-header"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={HEADER_TRANSITION}
          >
            <AnalyticsPocCardHeader
              icon={
                <Image
                  alt=""
                  className={cn(
                    "shrink-0",
                    ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS,
                  )}
                  fill
                  sizes="16px"
                  src={iconSrc}
                />
              }
              title={title}
              tooltipText={infoTooltipText}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bars */}
      <AnimatePresence mode="wait" initial={false}>
        {activeDrilldown ? (
          <motion.div
            key={activeClusterId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <StaggeredBarList
              items={activeDrilldown.items}
              direction={directionRef.current}
            />
          </motion.div>
        ) : (
          <motion.div
            key="root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <StaggeredBarList
              items={items}
              onItemClick={isClickable ? handleItemClick : undefined}
              direction={directionRef.current}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnalyticsPocPanel>
  );
}
