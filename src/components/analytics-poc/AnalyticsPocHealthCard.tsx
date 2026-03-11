"use client";

import { cn } from "@/lib/utils";
import {
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocMediumCardBase } from "./AnalyticsPocMediumCardBase";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocHealthCardProps } from "./types";

const RING_SIZE = 148;
const RING_CIRCLE_SIZE = 140;
const RING_STROKE_WIDTH = 4;
const RING_RADIUS = (RING_CIRCLE_SIZE - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function HeartbeatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="dark:invert">
      <path
        d="M1 8.5H3.5L5.5 4L8 12L10 6.5L11.5 8.5H15"
        stroke="#252525"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScoreRing({
  score,
  progressPercent,
  accentColor,
}: {
  score: string;
  progressPercent: number;
  accentColor: string;
}) {
  const bounded = Math.min(100, Math.max(0, progressPercent));
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - bounded / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        className="absolute inset-0"
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth={RING_STROKE_WIDTH}
          opacity={0.2}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth={RING_STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-inter text-5xl font-medium leading-none tracking-[-0.96px] text-[var(--ap-text)]">
          {score}
        </span>
        <span
          className="mt-1 font-inter text-xs font-medium leading-none"
          style={{ color: accentColor }}
        >
          Healthy
        </span>
      </div>
    </div>
  );
}

export function AnalyticsPocHealthCard({
  title,
  score,
  statusText,
  ctaLabel,
  progressPercent = 75,
  className,
}: AnalyticsPocHealthCardProps) {
  return (
    <AnalyticsPocMediumCardBase className={className}>
      <AnalyticsPocCardHeader
        icon={<HeartbeatIcon />}
        title={title}
      />

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex max-w-[220px] flex-col gap-1.5">
            <p className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
              Looking healthy!
            </p>
            <p className="font-inter text-sm leading-[1.4] tracking-[-0.02em] text-foreground/70">
              {statusText}
            </p>
          </div>

          <button
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "w-fit cursor-pointer rounded-full bg-foreground/[0.06] px-3 py-1.5 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]",
            )}
            type="button"
          >
            {ctaLabel}
          </button>
        </div>

        <ScoreRing
          score={score}
          progressPercent={progressPercent}
          accentColor="#00B259"
        />
      </div>
    </AnalyticsPocMediumCardBase>
  );
}
