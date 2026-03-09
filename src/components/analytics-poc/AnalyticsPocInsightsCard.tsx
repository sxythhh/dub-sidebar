"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { GlassActionButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { AnalyticsPocCardEffectsLayer } from "./AnalyticsPocCardEffectsLayer";
import {
  ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocMediumCardBase } from "./AnalyticsPocMediumCardBase";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type {
  AnalyticsPocInsightSlide,
  AnalyticsPocInsightsCardProps,
} from "./types";

const AI_INSIGHTS_DEFAULT_EFFECTS = {
  accentColor: "#EC3EFF",
  graphicSrc: "/effects/ai-insights-sparkle.svg",
} as const;

type SlideDirection = -1 | 0 | 1;

function resolveInsightsEffects(
  effects: AnalyticsPocInsightsCardProps["effects"],
): { accentColor: string; graphicSrc: string } | undefined {
  if (!effects) {
    return undefined;
  }

  return {
    accentColor: effects.accentColor ?? AI_INSIGHTS_DEFAULT_EFFECTS.accentColor,
    graphicSrc: effects.graphicSrc || AI_INSIGHTS_DEFAULT_EFFECTS.graphicSrc,
  };
}

function clampSlideIndex(index: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  if (!Number.isFinite(index)) {
    return 0;
  }

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

export function AnalyticsPocInsightsCard({
  title,
  description,
  contentTitle,
  contentSubtitle,
  ctaLabel,
  iconSrc = "/icons/svg/analytics-insights-sparkle.svg",
  slides,
  initialSlide,
  onSlideChange,
  pager,
  effects,
  showPagerUi = true,
  className,
}: AnalyticsPocInsightsCardProps) {
  const resolvedEffects = resolveInsightsEffects(effects);
  const resolvedSlides = useMemo(() => {
    if (slides?.length) {
      return slides;
    }

    return buildLegacySlides({
      contentSubtitle,
      contentTitle,
      ctaLabel,
      description,
      pagerTotal: pager?.total,
    });
  }, [
    slides,
    ctaLabel,
    contentSubtitle,
    contentTitle,
    description,
    pager?.total,
  ]);
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
      if (current === nextIndex) {
        return current;
      }

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
    : {
        duration: 0.16,
        ease: [0.22, 1, 0.36, 1] as const,
      };
  const slideVariants = {
    center: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      x: 0,
    },
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

  const goToSlide = (nextIndex: number) => {
    const normalizedIndex = clampSlideIndex(nextIndex, dots);

    if (normalizedIndex === activeSlideIndex) {
      return;
    }

    setSlideDirection(normalizedIndex > activeSlideIndex ? 1 : -1);
    setActiveSlideIndex(normalizedIndex);
  };

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
      className={cn(resolvedEffects && "group/card-effects", className)}
      effectsLayer={
        resolvedEffects ? (
          <AnalyticsPocCardEffectsLayer
            accentColor={resolvedEffects.accentColor}
            graphicSrc={resolvedEffects.graphicSrc}
          />
        ) : undefined
      }
    >
      <AnalyticsPocCardHeader
        icon={
          <Image
            alt=""
            className={ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS}
            height={16}
            src={iconSrc}
            width={16}
          />
        }
        rightContent={
          showPagerControls ? (
            <div className="flex items-center gap-2">
              <button
                aria-label="Go to previous insight"
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "flex size-6 cursor-pointer items-center justify-center rounded-full bg-[var(--ap-badge-pill)] text-[var(--ap-text-tertiary)] transition-[transform,background-color,color,box-shadow] duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)] hover:-translate-y-px hover:bg-[var(--ap-input-bg)] hover:text-[var(--ap-text-strong)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] motion-reduce:transform-none",
                )}
                onClick={handlePreviousSlide}
                type="button"
              >
                <ChevronLeft className="size-3" />
              </button>
              {Array.from({ length: dots }).map((_, index) => {
                const isActive = index === activeSlideIndex;

                return (
                  <button
                    aria-label={`Go to insight ${index + 1}`}
                    className={cn(
                      ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                      "h-1 cursor-pointer rounded-full transition-[width,background-color,opacity,transform] duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)] hover:-translate-y-px motion-reduce:transform-none",
                      isActive
                        ? "w-5 bg-[var(--ap-text-strong)] opacity-100"
                        : "w-2 bg-[var(--ap-text-quaternary)] opacity-75 hover:opacity-100",
                    )}
                    key={`insights-dot-${index + 1}`}
                    onClick={() => goToSlide(index)}
                    type="button"
                  />
                );
              })}
              <button
                aria-label="Go to next insight"
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "flex size-6 cursor-pointer items-center justify-center rounded-full bg-[var(--ap-badge-pill)] text-[var(--ap-text-tertiary)] transition-[transform,background-color,color,box-shadow] duration-[var(--ap-motion-duration-hover)] ease-[var(--ap-motion-ease-primary)] hover:-translate-y-px hover:bg-[var(--ap-input-bg)] hover:text-[var(--ap-text-strong)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] motion-reduce:transform-none",
                )}
                onClick={handleNextSlide}
                type="button"
              >
                <ChevronRight className="size-3" />
              </button>
            </div>
          ) : null
        }
        title={title}
      />

      <div className="relative mt-auto flex min-h-[86px] items-end justify-between gap-4">
        <div className="relative -mx-1 min-h-[86px] flex-1 overflow-hidden px-1">
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
              <div className="max-w-[320px] space-y-[6px]">
                {activeTitle ? (
                  <p className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
                    {activeTitle}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "font-inter text-[14px] font-normal tracking-[-0.09px] text-[var(--ap-text-strong)]",
                    activeTitle ? "leading-[1.45]" : "leading-[1.35]",
                  )}
                >
                  {subtitleText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <GlassActionButton
          className={cn(
            ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
            "h-8 min-w-0 shrink-0 cursor-pointer px-3 text-xs",
          )}
        >
          {activeCtaLabel}
        </GlassActionButton>
      </div>
    </AnalyticsPocMediumCardBase>
  );
}
