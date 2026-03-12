"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocMediumCardBase } from "./AnalyticsPocMediumCardBase";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type {
  AnalyticsPocInsightSlide,
  AnalyticsPocInsightsCardProps,
} from "./types";

type SlideDirection = -1 | 0 | 1;

function clampSlideIndex(index: number, total: number) {
  if (total <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.min(total - 1, Math.max(0, Math.trunc(index)));
}

function buildLegacySlides({
  ctaLabel,
  contentSubtitle,
  contentTitle,
  description,
  pagerTotal,
}: {
  ctaLabel: string;
  contentSubtitle?: string;
  contentTitle?: string;
  description: string;
  pagerTotal?: number;
}): AnalyticsPocInsightSlide[] {
  const totalSlides = Math.max(1, pagerTotal ?? 1);
  const subtitle = contentSubtitle ?? description;
  return Array.from({ length: totalSlides }, (_, index) => ({
    contentSubtitle: subtitle,
    contentTitle,
    ctaLabel,
    id: `legacy-slide-${index + 1}`,
  }));
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L9.79 6.21L15 8L9.79 9.79L8 15L6.21 9.79L1 8L6.21 6.21L8 1Z"
        fill="currentColor"
        className="text-foreground/70"
      />
    </svg>
  );
}

export function AnalyticsPocInsightsCard({
  title,
  description,
  contentTitle,
  contentSubtitle,
  ctaLabel,
  slides,
  initialSlide,
  onSlideChange,
  pager,
  showPagerUi = true,
  className,
}: AnalyticsPocInsightsCardProps) {
  const resolvedSlides = useMemo(() => {
    if (slides?.length) return slides;
    return buildLegacySlides({
      contentSubtitle,
      contentTitle,
      ctaLabel,
      description,
      pagerTotal: pager?.total,
    });
  }, [slides, ctaLabel, contentSubtitle, contentTitle, description, pager?.total]);

  const dots = Math.max(1, resolvedSlides.length);
  const preferredInitialIndex = initialSlide ?? (pager?.current ?? 1) - 1;
  const prefersReducedMotion = useReducedMotion();
  const [activeSlideIndex, setActiveSlideIndex] = useState(() =>
    clampSlideIndex(preferredInitialIndex, dots),
  );
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(0);

  useEffect(() => {
    setActiveSlideIndex((current) => clampSlideIndex(current, dots));
  }, [dots]);

  useEffect(() => {
    const nextIndex = clampSlideIndex(preferredInitialIndex, dots);
    setActiveSlideIndex((current) => {
      if (current === nextIndex) return current;
      setSlideDirection(nextIndex > current ? 1 : -1);
      return nextIndex;
    });
  }, [preferredInitialIndex, dots]);

  useEffect(() => {
    onSlideChange?.(activeSlideIndex);
  }, [activeSlideIndex, onSlideChange]);

  const activeSlide =
    resolvedSlides[activeSlideIndex] ??
    buildLegacySlides({ ctaLabel, description })[0];
  const activeTitle = activeSlide.contentTitle;
  const subtitleText = activeSlide.contentSubtitle;
  const activeCtaLabel = activeSlide.ctaLabel ?? ctaLabel;
  const showPagerControls = showPagerUi && dots > 1;
  const carouselTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const };
  const slideVariants = {
    center: { filter: "blur(0px)", opacity: 1, scale: 1, x: 0 },
    enter: (direction: SlideDirection) => ({
      filter: prefersReducedMotion ? "blur(0px)" : "blur(1px)",
      opacity: prefersReducedMotion ? 1 : 0,
      scale: prefersReducedMotion ? 1 : 0.996,
      x: prefersReducedMotion ? 0 : direction >= 0 ? 10 : -10,
    }),
    exit: (direction: SlideDirection) => ({
      filter: prefersReducedMotion ? "blur(0px)" : "blur(1px)",
      opacity: prefersReducedMotion ? 1 : 0,
      scale: prefersReducedMotion ? 1 : 0.996,
      x: prefersReducedMotion ? 0 : direction >= 0 ? -10 : 10,
    }),
  } as const;

  const handlePreviousSlide = () => {
    setSlideDirection(-1);
    setActiveSlideIndex((current) => (current - 1 + dots) % dots);
  };

  const handleNextSlide = () => {
    setSlideDirection(1);
    setActiveSlideIndex((current) => (current + 1) % dots);
  };

  return (
    <AnalyticsPocMediumCardBase
      className={cn("overflow-visible", className)}
      effectsLayer={
        <>
          {/* Pink/magenta gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              opacity: 0.3,
              filter: "blur(6px)",
              transform: "matrix(-1, 0, 0, 1, 0, 0)",
              background: "linear-gradient(95.54deg, rgba(255,63,213,0) 0%, #FF3FD5 25%, rgba(255,63,213,0) 50%, #FF3FD5 75%, rgba(255,63,213,0) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: 1.5,
            }}
          />
          {/* Orange gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              opacity: 0.3,
              filter: "blur(6px)",
              background: "linear-gradient(95.54deg, rgba(255,144,37,0) 0%, #FF9025 25%, rgba(255,144,37,0) 50%, #FF9025 75%, rgba(255,144,37,0) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: 1.5,
            }}
          />
        </>
      }
    >
      <AnalyticsPocCardHeader
        icon={<SparkleIcon />}
        rightContent={
          showPagerControls ? (
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Go to previous insight"
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground",
                )}
                onClick={handlePreviousSlide}
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="font-inter text-sm tracking-[-0.02em] text-foreground">
                {activeSlideIndex + 1}/{dots}
              </span>
              <button
                aria-label="Go to next insight"
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground",
                )}
                onClick={handleNextSlide}
                type="button"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null
        }
        title={title}
      />

      <div className="relative mt-auto flex min-h-[86px] flex-col gap-3">
        <div className="relative -mx-1 min-h-[63px] flex-1 overflow-hidden px-1">
          <AnimatePresence custom={slideDirection} initial={false} mode="sync">
            <motion.div
              animate="center"
              className="absolute inset-0 flex items-end will-change-transform"
              custom={slideDirection}
              exit="exit"
              initial="enter"
              key={`${activeSlide.id}-${activeSlideIndex}`}
              transition={carouselTransition}
              variants={slideVariants}
            >
              <div className="flex max-w-[360px] flex-col gap-1.5">
                {activeTitle ? (
                  <p className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
                    {activeTitle}
                  </p>
                ) : null}
                <p className="font-inter text-sm leading-[1.4] tracking-[-0.02em] text-foreground/70">
                  {subtitleText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className={cn(
            ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
            "w-fit cursor-pointer rounded-full bg-foreground/[0.06] px-3 py-1.5 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]",
          )}
          type="button"
        >
          {activeCtaLabel}
        </button>
      </div>
    </AnalyticsPocMediumCardBase>
  );
}
