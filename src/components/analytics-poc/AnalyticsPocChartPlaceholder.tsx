"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocChartTooltip,
  type AnalyticsPocChartTooltipRow,
} from "./AnalyticsPocChartTooltip";
import type {
  AnalyticsPocChartPlaceholderProps,
  AnalyticsPocPerformanceLineSeries,
  AnalyticsPocStackedBarSeries,
} from "./types";
import { useAnalyticsPocChartHover } from "./useAnalyticsPocChartHover";

const PERFORMANCE_TOOLTIP_WIDTH = 200;
const PERFORMANCE_TOOLTIP_SIDE_GAP = 12;
const HOVER_DIM_OPACITY = 0.32;
const HOVER_FOCUS_TOTAL_WIDTH = 44;
const HOVER_FOCUS_CORE_WIDTH = 12;
const HOVER_FOCUS_EDGE_FADE_WIDTH = 16;
const HOVER_OPACITY_TRANSITION_MS = 200;
const TOGGLE_OPACITY_TRANSITION_MS = 380;
const HOVER_OPACITY_TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const LINE_START_FADE_OPACITY = 0.2;
const LINE_START_FADE_END_OFFSET = "14%";
const STACKED_BAR_MAX_SIZE = 34;
const STACKED_BAR_CATEGORY_GAP = "14%";

// ── Animated Y-axis labels ──────────────────────────────────────────

/** Parse a compact label like "100k", "1.5k", "8%", "800" into a raw number + suffix */
function parseYLabel(label: string): { value: number; suffix: string } {
  const trimmed = label.trim();
  const match = trimmed.match(/^([+-]?\d*\.?\d+)\s*(%|[kKmMbB]?)$/);
  if (!match) return { value: 0, suffix: "" };

  let num = Number.parseFloat(match[1]);
  const suffix = match[2];

  // Normalize multiplier suffixes to raw number for interpolation
  if (suffix === "k" || suffix === "K") num *= 1000;
  else if (suffix === "m" || suffix === "M") num *= 1_000_000;
  else if (suffix === "b" || suffix === "B") num *= 1_000_000_000;

  return { value: Number.isFinite(num) ? num : 0, suffix };
}

/** Format an interpolated number back to compact form matching the target label's style */
function formatYLabel(value: number, targetSuffix: string): string {
  if (targetSuffix === "%") {
    // Decide decimal places based on magnitude
    if (Math.abs(value) < 0.05) return "0%";
    if (value === Math.round(value)) return `${Math.round(value)}%`;
    return `${value.toFixed(1).replace(/\.0$/, "")}%`;
  }

  const abs = Math.abs(value);
  if (targetSuffix === "k" || targetSuffix === "K") {
    const v = value / 1000;
    if (abs < 50) return `${Number(v.toFixed(2)).toString()}k`;
    if (v === Math.round(v)) return `${Math.round(v)}k`;
    return `${Number(v.toFixed(1)).toString()}k`;
  }
  if (targetSuffix === "m" || targetSuffix === "M") {
    const v = value / 1_000_000;
    return `${Number(v.toFixed(2)).toString()}M`;
  }

  // Plain number
  if (abs < 1) return "0";
  if (value === Math.round(value)) return `${Math.round(value)}`;
  return `${Number(value.toFixed(1)).toString()}`;
}

const LABEL_ANIM_DURATION_MS = 400;
const LABEL_ANIM_EASING = (t: number) => {
  // cubic-bezier(0.22, 1, 0.36, 1) approximation — ease-out expo
  return 1 - (1 - t) ** 3;
};

function useAnimatedLabels(targetLabels: string[]): string[] {
  const [displayed, setDisplayed] = useState(targetLabels);
  const prevTargetsRef = useRef(targetLabels);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const fromValuesRef = useRef<{ value: number; suffix: string }[]>(
    targetLabels.map(parseYLabel),
  );
  const toValuesRef = useRef<{ value: number; suffix: string }[]>(
    targetLabels.map(parseYLabel),
  );

  const animate = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / LABEL_ANIM_DURATION_MS, 1);
    const eased = LABEL_ANIM_EASING(progress);

    const from = fromValuesRef.current;
    const to = toValuesRef.current;
    const interpolated = to.map((target, i) => {
      const source = from[i] ?? target;
      const current = source.value + (target.value - source.value) * eased;
      return formatYLabel(current, target.suffix);
    });

    setDisplayed(interpolated);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    const prev = prevTargetsRef.current;
    const changed =
      targetLabels.length !== prev.length ||
      targetLabels.some((label, i) => label !== prev[i]);

    if (!changed) return;

    // Snapshot current displayed values as the "from"
    fromValuesRef.current = prev.map(parseYLabel);
    toValuesRef.current = targetLabels.map(parseYLabel);
    prevTargetsRef.current = targetLabels;

    cancelAnimationFrame(rafRef.current);
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [targetLabels, animate]);

  return displayed;
}

// ── Reduced motion ──────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return prefersReducedMotion;
}


interface StackedBarSegmentShapeProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number | string;
  radius?: number;
}

function toFiniteNumber(value?: number | string) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (max < min) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function toGradientOffset(value: number, width: number) {
  if (!Number.isFinite(width) || width <= 0) {
    return "0%";
  }

  return `${(clampNumber(value, 0, width) / width) * 100}%`;
}

function createActiveMetricKeySet(
  visibleMetricKeys: string[] | undefined,
  fallbackMetricKeys: string[],
) {
  return new Set(visibleMetricKeys ?? fallbackMetricKeys);
}

function resolveTooltipLeft({
  activeHoverX,
  chartPlotWidth,
}: {
  activeHoverX: number | undefined;
  chartPlotWidth: number;
}) {
  if (activeHoverX === undefined || chartPlotWidth <= 0) {
    return undefined;
  }

  const maxLeft = Math.max(0, chartPlotWidth - PERFORMANCE_TOOLTIP_WIDTH);
  const preferredRightLeft = activeHoverX + PERFORMANCE_TOOLTIP_SIDE_GAP;

  if (preferredRightLeft + PERFORMANCE_TOOLTIP_WIDTH <= chartPlotWidth) {
    return preferredRightLeft;
  }

  const preferredLeftLeft =
    activeHoverX - PERFORMANCE_TOOLTIP_SIDE_GAP - PERFORMANCE_TOOLTIP_WIDTH;

  if (preferredLeftLeft >= 0) {
    return preferredLeftLeft;
  }

  return clampNumber(preferredRightLeft, 0, maxLeft);
}

function formatPerformanceTooltipValue(
  value: number,
  series: AnalyticsPocPerformanceLineSeries,
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  const resolvedValueType =
    series.tooltipValueType ?? (series.axis === "right" ? "percent" : "number");

  if (resolvedValueType === "percent") {
    const decimals = series.tooltipDecimals ?? 1;
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value)}%`;
  }

  if (resolvedValueType === "currency") {
    const decimals = series.tooltipDecimals ?? 0;
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      style: "currency",
    }).format(value);
  }

  const decimals = series.tooltipDecimals ?? 0;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

function buildPerformanceSeriesLine({
  lineKey,
  series,
  stroke,
  strokeOpacity,
  transitionDurationMs,
}: {
  lineKey: string;
  series: AnalyticsPocPerformanceLineSeries;
  stroke: string;
  strokeOpacity: number;
  transitionDurationMs: number;
}) {
  return (
    <Line
      activeDot={false}
      animationDuration={450}
      animationEasing="ease-out"
      dataKey={series.key}
      dot={false}
      isAnimationActive
      key={lineKey}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={strokeOpacity}
      strokeWidth={1.5}
      style={{
        transition: `stroke-opacity ${transitionDurationMs}ms ${HOVER_OPACITY_TRANSITION_EASING}`,
      }}
      type="natural"
      yAxisId={series.axis}
    />
  );
}

function buildPerformanceTooltipRows({
  activeHover,
  activeMetricKeys,
  dataset,
  seriesList,
}: {
  activeHover: { index: number } | null;
  activeMetricKeys: Set<string>;
  dataset: NonNullable<
    AnalyticsPocChartPlaceholderProps["lineChart"]
  >["datasets"]["daily"];
  seriesList: AnalyticsPocPerformanceLineSeries[];
}) {
  if (!activeHover) {
    return [];
  }

  const dataPoint = dataset[activeHover.index];
  if (!dataPoint) {
    return [];
  }

  return seriesList
    .filter((series) => activeMetricKeys.has(series.key))
    .map((series) => ({
      color: series.color,
      key: series.key,
      label: series.label,
      value: formatPerformanceTooltipValue(dataPoint[series.key], series),
    }));
}

function buildPerformanceSeriesLayers({
  activeMetricKeys,
  hoverFocusGradientIdPrefix,
  lineGradientIdPrefix,
  seriesList,
  shouldRenderFocusWindow,
}: {
  activeMetricKeys: Set<string>;
  hoverFocusGradientIdPrefix: string;
  lineGradientIdPrefix: string;
  seriesList: AnalyticsPocPerformanceLineSeries[];
  shouldRenderFocusWindow: boolean;
}) {
  return seriesList.flatMap((series) => {
    const isActive = activeMetricKeys.has(series.key);
    const restStroke = `url(#${lineGradientIdPrefix}-${series.key})`;
    const focusStroke = `url(#${hoverFocusGradientIdPrefix}-${series.key})`;
    const baseStroke = shouldRenderFocusWindow ? series.color : restStroke;
    const baseOpacity = isActive
      ? shouldRenderFocusWindow
        ? HOVER_DIM_OPACITY
        : 1
      : 0;
    const focusOpacity = isActive && shouldRenderFocusWindow ? 1 : 0;
    // Use longer transition for toggle (active↔inactive), shorter for hover dim
    const baseTransitionMs = isActive
      ? HOVER_OPACITY_TRANSITION_MS
      : TOGGLE_OPACITY_TRANSITION_MS;

    return [
      buildPerformanceSeriesLine({
        lineKey: `${series.key}-base`,
        series,
        stroke: baseStroke,
        strokeOpacity: baseOpacity,
        transitionDurationMs: baseTransitionMs,
      }),
      buildPerformanceSeriesLine({
        lineKey: `${series.key}-focus`,
        series,
        stroke: focusStroke,
        strokeOpacity: focusOpacity,
        transitionDurationMs: HOVER_OPACITY_TRANSITION_MS,
      }),
    ];
  });
}

function StackedBarSegmentShape({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth = 1,
  opacity,
  radius: radiusProp = 0,
}: StackedBarSegmentShapeProps) {
  const normalizedX = toFiniteNumber(x);
  const normalizedY = toFiniteNumber(y);
  const normalizedWidth = toFiniteNumber(width);
  const normalizedHeight = toFiniteNumber(height);
  const normalizedOpacity = toFiniteNumber(opacity);

  if (
    normalizedX === undefined ||
    normalizedY === undefined ||
    normalizedWidth === undefined ||
    normalizedHeight === undefined ||
    normalizedWidth <= 0 ||
    normalizedHeight <= 0
  ) {
    return null;
  }

  const radius = Math.max(0, Math.min(radiusProp, normalizedWidth / 2, normalizedHeight));
  const right = normalizedX + normalizedWidth;
  const bottom = normalizedY + normalizedHeight;

  const fillPath =
    radius > 0
      ? [
          `M${normalizedX},${bottom}`,
          `L${normalizedX},${normalizedY + radius}`,
          `Q${normalizedX},${normalizedY} ${normalizedX + radius},${normalizedY}`,
          `L${right - radius},${normalizedY}`,
          `Q${right},${normalizedY} ${right},${normalizedY + radius}`,
          `L${right},${bottom}`,
          "Z",
        ].join(" ")
      : [
          `M${normalizedX},${bottom}`,
          `L${normalizedX},${normalizedY}`,
          `L${right},${normalizedY}`,
          `L${right},${bottom}`,
          "Z",
        ].join(" ");

  const strokePath =
    radius > 0
      ? [
          `M${normalizedX},${bottom}`,
          `L${normalizedX},${normalizedY + radius}`,
          `Q${normalizedX},${normalizedY} ${normalizedX + radius},${normalizedY}`,
          `L${right - radius},${normalizedY}`,
          `Q${right},${normalizedY} ${right},${normalizedY + radius}`,
          `L${right},${bottom}`,
        ].join(" ")
      : [
          `M${normalizedX},${bottom}`,
          `L${normalizedX},${normalizedY}`,
          `L${right},${normalizedY}`,
          `L${right},${bottom}`,
        ].join(" ");

  return (
    <g
      opacity={
        normalizedOpacity === undefined
          ? undefined
          : clampNumber(normalizedOpacity, 0, 1)
      }
    >
      <path d={fillPath} fill={fill ?? "transparent"} />
      {stroke ? (
        <path
          d={strokePath}
          fill="none"
          stroke={stroke}
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </g>
  );
}

function formatStackedTooltipValue(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function buildStackedTooltipRows({
  activeHover,
  activeMetricKeys,
  dataset,
  seriesList,
}: {
  activeHover: { index: number } | null;
  activeMetricKeys: Set<string>;
  dataset: NonNullable<
    AnalyticsPocChartPlaceholderProps["stackedBarChart"]
  >["points"];
  seriesList: AnalyticsPocStackedBarSeries[];
}) {
  if (!activeHover) {
    return [];
  }

  const dataPoint = dataset[activeHover.index];
  if (!dataPoint) {
    return [];
  }

  return seriesList
    .filter((series) => activeMetricKeys.has(series.key))
    .map((series) => ({
      color: series.color,
      key: series.key,
      label: series.label,
      value: formatStackedTooltipValue(dataPoint[series.key]),
    }));
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Keeping hover layout and synchronized overlays in one place avoids chart drift between layers.
function PerformanceMainLineChartBody({
  activeLineDataset,
  lineChart,
  visibleMetricKeys,
  onDayClick,
}: {
  activeLineDataset: "daily" | "cumulative";
  lineChart: NonNullable<AnalyticsPocChartPlaceholderProps["lineChart"]>;
  visibleMetricKeys?: string[];
  onDayClick?: (index: number, label: string) => void;
}) {
  const chartHoverRootRef = useRef<HTMLDivElement>(null);
  const chartPlotAreaRef = useRef<HTMLDivElement>(null);
  const lineGradientIdPrefix = useId().replace(/:/g, "");
  const hoverFocusGradientIdPrefix = useId().replace(/:/g, "");

  const dataset =
    lineChart.datasets[activeLineDataset] ?? lineChart.datasets.daily;
  const activeMetricKeys = useMemo(
    () =>
      createActiveMetricKeySet(
        visibleMetricKeys,
        lineChart.series.map((series) => series.key),
      ),
    [lineChart.series, visibleMetricKeys],
  );

  const isInteractionEnabled = activeMetricKeys.size > 0;
  const { activeHover, handleChartClick, handleMouseLeave, handleMouseMove } =
    useAnalyticsPocChartHover({
      chartContainerRef: chartHoverRootRef,
      data: dataset,
      isEnabled: isInteractionEnabled,
    });

  const handleLineChartClick = (eventState: unknown) => {
    handleChartClick(eventState);
    if (!onDayClick || !eventState || typeof eventState !== "object") return;
    const state = eventState as {
      activeTooltipIndex?: number | string;
      activePayload?: Array<{ payload?: { label?: string } }>;
    };
    const index =
      typeof state.activeTooltipIndex === "number"
        ? state.activeTooltipIndex
        : undefined;
    const label = state.activePayload?.[0]?.payload?.label;
    if (index !== undefined && label) {
      onDayClick(index, label);
    }
  };

  const chartPlotWidth = chartPlotAreaRef.current?.clientWidth ?? 0;
  const activeHoverX =
    activeHover && chartPlotWidth > 0
      ? clampNumber(activeHover.x, 0, chartPlotWidth)
      : undefined;
  const tooltipLeft = resolveTooltipLeft({ activeHoverX, chartPlotWidth });

  const tooltipRows = useMemo<AnalyticsPocChartTooltipRow[]>(() => {
    return buildPerformanceTooltipRows({
      activeHover,
      activeMetricKeys,
      dataset,
      seriesList: lineChart.series,
    });
  }, [activeHover, activeMetricKeys, dataset, lineChart.series]);

  const activeHoverLabel = activeHover?.label ?? "";
  const shouldShowHoverState = Boolean(
    activeHoverLabel &&
      activeHoverX !== undefined &&
      tooltipLeft !== undefined &&
      tooltipRows.length > 0,
  );
  const focusCenterX =
    shouldShowHoverState && activeHoverX !== undefined && chartPlotWidth > 0
      ? activeHoverX
      : undefined;
  const focusHalfCore = HOVER_FOCUS_CORE_WIDTH / 2;
  const focusHalfTotal = Math.min(
    HOVER_FOCUS_TOTAL_WIDTH / 2,
    focusHalfCore + HOVER_FOCUS_EDGE_FADE_WIDTH,
  );
  const focusLeft =
    focusCenterX !== undefined ? focusCenterX - focusHalfTotal : 0;
  const focusRight =
    focusCenterX !== undefined ? focusCenterX + focusHalfTotal : 0;
  const leftFadeStartX =
    focusCenterX !== undefined ? clampNumber(focusLeft, 0, chartPlotWidth) : 0;
  const leftFadeEndX =
    focusCenterX !== undefined
      ? clampNumber(focusCenterX - focusHalfCore, 0, chartPlotWidth)
      : 0;
  const rightFadeStartX =
    focusCenterX !== undefined
      ? clampNumber(focusCenterX + focusHalfCore, 0, chartPlotWidth)
      : 0;
  const rightFadeEndX =
    focusCenterX !== undefined ? clampNumber(focusRight, 0, chartPlotWidth) : 0;
  const shouldRenderFocusWindow = focusCenterX !== undefined;
  const leftFadeStartOffset = toGradientOffset(leftFadeStartX, chartPlotWidth);
  const leftFadeEndOffset = toGradientOffset(leftFadeEndX, chartPlotWidth);
  const rightFadeStartOffset = toGradientOffset(
    rightFadeStartX,
    chartPlotWidth,
  );
  const rightFadeEndOffset = toGradientOffset(rightFadeEndX, chartPlotWidth);
  const renderedSeriesLines = useMemo(
    () =>
      buildPerformanceSeriesLayers({
        activeMetricKeys,
        hoverFocusGradientIdPrefix,
        lineGradientIdPrefix,
        seriesList: lineChart.series,
        shouldRenderFocusWindow,
      }),
    [
      activeMetricKeys,
      hoverFocusGradientIdPrefix,
      lineGradientIdPrefix,
      lineChart.series,
      shouldRenderFocusWindow,
    ],
  );

  const primarySeries = lineChart.series.find((s) => activeMetricKeys.has(s.key));
  const primaryColor = primarySeries?.color ?? "rgba(0,0,0,0.4)";
  const primaryYLabels = primarySeries?.yLabels ?? lineChart.yLabels;
  const animatedYLabels = useAnimatedLabels(primaryYLabels);

  const leftDomain: [number, number] =
    primarySeries?.axis === "left" && primarySeries.domain
      ? (primarySeries.domain as [number, number])
      : (lineChart.leftDomain as [number, number]) ?? [0, 100000];
  const rightDomain: [number, number] =
    primarySeries?.axis === "right" && primarySeries.domain
      ? (primarySeries.domain as [number, number])
      : (lineChart.rightDomain as [number, number]) ?? [0, 8];

  return (
    <div className="absolute inset-0 chart-no-focus-ring" ref={chartHoverRootRef}>
      <div className="absolute inset-x-0 bottom-7 top-0 flex items-end gap-4">
        {/* Y-axis labels — left side */}
        <div className="relative h-full w-5 shrink-0">
          <div className="absolute inset-0 flex flex-col items-end justify-between">
            {animatedYLabels.map((label, i) => (
              <span
                className="font-inter text-[10px] font-normal leading-[1.2] text-right"
                key={`y-${i}`}
                style={{ color: "rgba(37,37,37,0.5)" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-full min-h-0 flex-1" ref={chartPlotAreaRef}>
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={dataset}
              margin={{ bottom: 2, left: 0, right: 0, top: 0 }}
              onClick={handleLineChartClick}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={onDayClick ? { cursor: "pointer" } : undefined}
            >
              <XAxis
                dataKey="index"
                domain={[0, dataset.length - 1]}
                hide
                type="number"
              />
              <YAxis
                domain={leftDomain}
                hide
                yAxisId="left"
              />
              <YAxis
                domain={rightDomain}
                hide
                orientation="right"
                yAxisId="right"
              />

              {/* Keep Recharts tooltip tracking enabled without using the default UI */}
              <RechartsTooltip
                content={() => null}
                cursor={false}
                isAnimationActive={false}
                wrapperStyle={{ display: "none" }}
              />

              <defs>
                {lineChart.series.map((series) => {
                  const startFadeGradientId = `${lineGradientIdPrefix}-${series.key}`;
                  const hoverFocusGradientId = `${hoverFocusGradientIdPrefix}-${series.key}`;

                  return [
                    <linearGradient
                      id={startFadeGradientId}
                      key={startFadeGradientId}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={series.color}
                        stopOpacity={LINE_START_FADE_OPACITY}
                      />
                      <stop
                        offset={LINE_START_FADE_END_OFFSET}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                    </linearGradient>,
                    <linearGradient
                      id={hoverFocusGradientId}
                      key={hoverFocusGradientId}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset={leftFadeStartOffset}
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset={leftFadeEndOffset}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset={rightFadeStartOffset}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset={rightFadeEndOffset}
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset="100%"
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                    </linearGradient>,
                  ];
                })}
              </defs>

              {renderedSeriesLines}
            </LineChart>
          </ResponsiveContainer>

          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10"
            style={{
              opacity: shouldShowHoverState ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            <div
              className="absolute top-2"
              style={{
                left: tooltipLeft ?? 0,
                transition: "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <AnalyticsPocChartTooltip
                footerText={onDayClick ? "View Submissions" : undefined}
                label={activeHoverLabel}
                onFooterClick={
                  onDayClick && activeHover
                    ? () => onDayClick(activeHover.index, activeHoverLabel)
                    : undefined
                }
                rows={tooltipRows}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Hover crosshair line */}
      <div
        className="pointer-events-none absolute top-0 right-0"
        style={{
          bottom: 24,
          left: 36,
        }}
      >
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: activeHoverX ?? 0,
            width: 0,
            borderLeft: "1px solid var(--foreground)",
            opacity: shouldShowHoverState && activeHoverX !== undefined ? 0.2 : 0,
            transition: "left 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 100ms ease-out",
          }}
        />
      </div>

      {/* X-axis labels + hover date pill */}
      <div className="absolute bottom-0 right-0 flex h-6 items-center justify-between gap-2" style={{ left: 36 }}>
        {lineChart.xTicks.map((tick) => (
          <span
            className="font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]"
            key={`x-${tick.index}-${tick.label}`}
          >
            {tick.label}
          </span>
        ))}

        {/* Hover date pill */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 flex items-center justify-center"
          style={{
            left: activeHoverX ?? 0,
            transform: "translateX(-50%)",
            opacity: shouldShowHoverState ? 1 : 0,
            transition: "left 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 100ms ease-out",
          }}
        >
          <span className="whitespace-nowrap rounded-full border border-card-border bg-card-bg px-[10px] py-[6px] font-inter text-[10px] font-medium leading-[1.2] tracking-[0.1px] text-page-text-muted">
            {activeHoverLabel}
          </span>
        </div>
      </div>

    </div>
  );
}

function StackedBarChartBody({
  stackedBarChart,
  visibleMetricKeys,
  isAnimationEnabled,
  onDayClick,
}: {
  stackedBarChart: NonNullable<
    AnalyticsPocChartPlaceholderProps["stackedBarChart"]
  >;
  visibleMetricKeys?: string[];
  isAnimationEnabled: boolean;
  onDayClick?: (index: number, label: string) => void;
}) {
  const chartHoverRootRef = useRef<HTMLDivElement>(null);
  const chartPlotAreaRef = useRef<HTMLDivElement>(null);
  const activeMetricKeys = useMemo(
    () =>
      createActiveMetricKeySet(
        visibleMetricKeys,
        stackedBarChart.series.map((series) => series.key),
      ),
    [stackedBarChart.series, visibleMetricKeys],
  );

  const chartPoints = useMemo(
    () =>
      stackedBarChart.points.map((point) => ({
        ...point,
        facebook: activeMetricKeys.has("facebook") ? point.facebook : 0,
        instagram: activeMetricKeys.has("instagram") ? point.instagram : 0,
        tiktok: activeMetricKeys.has("tiktok") ? point.tiktok : 0,
        youtube: activeMetricKeys.has("youtube") ? point.youtube : 0,
      })),
    [activeMetricKeys, stackedBarChart.points],
  );
  const renderedStackSeries = [...stackedBarChart.series].reverse();
  // Find the topmost VISIBLE series key (last in renderedStackSeries that is active)
  const topVisibleSeriesKey = useMemo(() => {
    for (let i = renderedStackSeries.length - 1; i >= 0; i--) {
      if (activeMetricKeys.has(renderedStackSeries[i].key)) {
        return renderedStackSeries[i].key;
      }
    }
    return null;
  }, [renderedStackSeries, activeMetricKeys]);
  const isInteractionEnabled = activeMetricKeys.size > 0;
  const { activeHover, handleChartClick, handleMouseLeave, handleMouseMove } =
    useAnalyticsPocChartHover({
      chartContainerRef: chartHoverRootRef,
      data: chartPoints,
      isEnabled: isInteractionEnabled,
    });

  const handleBarChartClick = (eventState: unknown) => {
    handleChartClick(eventState);
    if (!onDayClick || !eventState || typeof eventState !== "object") return;
    const state = eventState as {
      activeTooltipIndex?: number | string;
      activePayload?: Array<{ payload?: { label?: string } }>;
    };
    const index =
      typeof state.activeTooltipIndex === "number"
        ? state.activeTooltipIndex
        : undefined;
    const label = state.activePayload?.[0]?.payload?.label;
    if (index !== undefined && label) {
      onDayClick(index, label);
    }
  };

  const chartPlotWidth = chartPlotAreaRef.current?.clientWidth ?? 0;
  const activeHoverX =
    activeHover && chartPlotWidth > 0
      ? clampNumber(activeHover.x, 0, chartPlotWidth)
      : undefined;
  const tooltipLeft = resolveTooltipLeft({ activeHoverX, chartPlotWidth });
  const tooltipRows = useMemo<AnalyticsPocChartTooltipRow[]>(() => {
    return buildStackedTooltipRows({
      activeHover,
      activeMetricKeys,
      dataset: chartPoints,
      seriesList: stackedBarChart.series,
    });
  }, [activeHover, activeMetricKeys, chartPoints, stackedBarChart.series]);
  const activeHoverLabel = activeHover?.label ?? "";
  const shouldShowHoverState = Boolean(
    activeHoverLabel &&
      activeHoverX !== undefined &&
      tooltipLeft !== undefined &&
      tooltipRows.length > 0,
  );

  // Compute dynamic max from visible data
  const dynamicMax = useMemo(() => {
    const seriesKeys = stackedBarChart.series.map((s) => s.key);
    const visibleKeys = seriesKeys.filter((k) => activeMetricKeys.has(k));
    if (visibleKeys.length === 0) return 1;
    return Math.max(
      ...chartPoints.map((point) =>
        visibleKeys.reduce((sum, key) => sum + (Number((point as unknown as Record<string, unknown>)[key]) || 0), 0),
      ),
      1,
    );
  }, [chartPoints, activeMetricKeys, stackedBarChart.series]);

  // Compute nice yLabels from dynamic max
  const dynamicYLabels = useMemo(() => {
    const steps = stackedBarChart.yLabels.length - 1;
    if (steps <= 0) return stackedBarChart.yLabels;
    // Round max up to a nice number
    const magnitude = 10 ** Math.floor(Math.log10(dynamicMax));
    const niceMax = Math.ceil(dynamicMax / magnitude) * magnitude;
    const labels: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = niceMax * (1 - i / steps);
      if (val >= 1000) {
        const k = val / 1000;
        labels.push(k === Math.round(k) ? `${Math.round(k)}k` : `${k.toFixed(1)}k`);
      } else {
        labels.push(`${Math.round(val)}`);
      }
    }
    return labels;
  }, [dynamicMax, stackedBarChart.yLabels.length]);

  const animatedYLabels = useAnimatedLabels(dynamicYLabels);
  const maxValue = useMemo(() => {
    const parsed = parseYLabel(dynamicYLabels[0]);
    return parsed.value || dynamicMax;
  }, [dynamicYLabels, dynamicMax]);

  return (
    <div className="absolute inset-0 flex gap-4 chart-no-focus-ring" ref={chartHoverRootRef}>
      <div className="flex h-full w-16 shrink-0 flex-col justify-between pb-7 pt-[7px]">
        {animatedYLabels.map((label, i) => (
          <div className="flex items-center justify-end" key={`left-${i}`}>
            <span
              className="inline-flex h-5 items-center justify-center rounded-md border border-[var(--ap-border,#e5e5e5)] bg-[var(--card-bg,#fff)] px-1.5 font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]"
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <div
          className="absolute inset-x-0 bottom-7 top-0"
          ref={chartPlotAreaRef}
        >
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              barCategoryGap={STACKED_BAR_CATEGORY_GAP}
              data={chartPoints}
              margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
              onClick={handleBarChartClick}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={onDayClick ? { cursor: "pointer" } : undefined}
            >
              <CartesianGrid
                horizontal
                stroke="var(--ap-border, #ebebeb)"
                strokeOpacity={0.6}
                vertical={false}
              />
              <RechartsTooltip
                content={() => null}
                cursor={false}
                isAnimationActive={false}
                wrapperStyle={{ display: "none" }}
              />

              <XAxis dataKey="index" hide />
              <YAxis domain={[0, maxValue]} hide />

              {renderedStackSeries.map(
                (series: AnalyticsPocStackedBarSeries) => {
                  return (
                    <Bar
                      animationDuration={400}
                      animationEasing="ease-out"
                      dataKey={series.key}
                      fill={series.color}
                      isAnimationActive={isAnimationEnabled}
                      key={series.key}
                      maxBarSize={STACKED_BAR_MAX_SIZE}
                      shape={<StackedBarSegmentShape radius={series.key === topVisibleSeriesKey ? 4 : 0} />}
                      stackId="posts"
                      stroke="none"
                      strokeWidth={0}
                    />
                  );
                },
              )}
            </BarChart>
          </ResponsiveContainer>

          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{
              opacity: shouldShowHoverState ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 150ms ease-out",
            }}
          >
            <div
              className="absolute top-2"
              style={{
                left: tooltipLeft ?? 0,
                transition: "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <AnalyticsPocChartTooltip
                footerText={onDayClick ? "View Submissions" : undefined}
                label={activeHoverLabel}
                onFooterClick={
                  onDayClick && activeHover
                    ? () => onDayClick(activeHover.index, activeHoverLabel)
                    : undefined
                }
                rows={tooltipRows}
              />
            </div>
          </div>

          {(() => {
            const barCount = chartPoints.length || 1;
            const barBandWidth = chartPlotWidth / barCount;
            const padding = 0.14;
            const colWidth = barBandWidth * (1 + padding * 2);
            const colLeft = activeHoverX !== undefined
              ? activeHoverX - colWidth / 2
              : 0;
            return (
              <span
                className="pointer-events-none absolute bottom-0"
                style={{
                  background: "currentColor",
                  borderRadius: 0,
                  left: colLeft,
                  opacity: shouldShowHoverState && activeHoverX !== undefined ? 0.05 : 0,
                  top: 0,
                  transition: "left 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 100ms ease-out",
                  width: colWidth,
                }}
              />
            );
          })()}

        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-6 items-center justify-between gap-2">
          {stackedBarChart.xTicks.map((tick) => (
            <span
              className="font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]"
              key={`tick-${tick.index}-${tick.label}`}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyChartState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full items-center justify-center rounded-[14px] border border-dashed border-[var(--ap-border)] bg-background/40",
        className,
      )}
    >
      <span className="font-inter text-xs text-muted-foreground/70">
        Chart data unavailable
      </span>
    </div>
  );
}

export function AnalyticsPocChartPlaceholder({
  variant,
  chartStylePreset = "default",
  lineChart,
  stackedBarChart,
  activeLineDataset = "daily",
  visibleMetricKeys,
  heightClassName = "h-[260px]",
  className,
  onDayClick,
}: AnalyticsPocChartPlaceholderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAnimationEnabled = !prefersReducedMotion;

  if (variant === "line" && lineChart) {
    const isPerformanceMain = chartStylePreset === "performance-main";

    return (
      <div
        className={cn(
          "relative overflow-visible",
          "card-enter-anim [--enter-d:0]",
          isPerformanceMain ? "" : "rounded-[14px] border border-[var(--ap-border)]",
          heightClassName,
          className,
        )}
      >
        <PerformanceMainLineChartBody
          activeLineDataset={activeLineDataset}
          lineChart={lineChart}
          onDayClick={onDayClick}
          visibleMetricKeys={visibleMetricKeys}
        />
      </div>
    );
  }

  if ((variant === "stacked" || variant === "bar") && stackedBarChart) {
    return (
      <div
        className={cn(
          "relative overflow-visible card-enter-anim [--enter-d:0]",
          heightClassName,
          className,
        )}
      >
        <StackedBarChartBody
          isAnimationEnabled={isAnimationEnabled}
          onDayClick={onDayClick}
          stackedBarChart={stackedBarChart}
          visibleMetricKeys={visibleMetricKeys}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", heightClassName, className)}>
      <EmptyChartState className="h-full" />
    </div>
  );
}
