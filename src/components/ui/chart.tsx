"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  /** For line charts with dual axes */
  axis?: "left" | "right";
  /** Custom domain for this series' axis */
  domain?: [number, number];
}

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export type ChartTooltipFormatter = (
  value: number,
  seriesKey: string,
  dataPoint: ChartDataPoint,
) => string;

// ── Shared constants ─────────────────────────────────────────────────

const GRID_STROKE = "var(--border)";
const GRID_DASH = "3 3";
const AXIS_TICK_STYLE = {
  fontSize: 11,
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fill: "var(--text-muted, #999)",
  letterSpacing: "-0.02em",
};
const HOVER_DIM_OPACITY = 0.32;
const TRANSITION_MS = 200;
const HOVER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const LINE_START_FADE_OPACITY = 0.2;
const LINE_START_FADE_END = "14%";
const TOOLTIP_WIDTH = 200;
const TOOLTIP_GAP = 12;
const FOCUS_CORE_HALF = 6;
const FOCUS_TOTAL_HALF = 22;

// ── Chart hover hook ────────────────────────────────────────────────

interface HoverPoint {
  index: number;
  x: number;
  label: string;
}

function useChartHover(
  containerRef: React.RefObject<HTMLElement | null>,
  data: ChartDataPoint[],
  enabled: boolean,
) {
  const [hover, setHover] = useState<HoverPoint | null>(null);

  useEffect(() => {
    if (!enabled) setHover(null);
  }, [enabled]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;
    const leave = () => setHover(null);
    el.addEventListener("mouseleave", leave);
    return () => el.removeEventListener("mouseleave", leave);
  }, [containerRef, enabled]);

  const onMouseMove = useCallback(
    (state: unknown) => {
      if (!enabled) return;
      const s = state as {
        isTooltipActive?: boolean;
        activeTooltipIndex?: number;
        activeCoordinate?: { x?: number };
        activePayload?: Array<{ payload?: { label?: string } }>;
      };
      if (
        !s?.isTooltipActive ||
        s.activeTooltipIndex == null ||
        s.activeCoordinate?.x == null
      )
        return;
      const idx = Number(s.activeTooltipIndex);
      if (idx < 0 || idx >= data.length) return;
      setHover({
        index: idx,
        x: s.activeCoordinate.x,
        label:
          s.activePayload?.[0]?.payload?.label ?? data[idx]?.label ?? "",
      });
    },
    [enabled, data],
  );

  const onMouseLeave = useCallback(() => {
    if (enabled) setHover(null);
  }, [enabled]);

  return { hover, onMouseMove, onMouseLeave };
}

// ── Tooltip positioning ─────────────────────────────────────────────

function resolveTooltipLeft(hoverX: number | undefined, plotWidth: number) {
  if (hoverX === undefined || plotWidth <= 0) return undefined;
  const maxLeft = Math.max(0, plotWidth - TOOLTIP_WIDTH);
  const right = hoverX + TOOLTIP_GAP;
  if (right + TOOLTIP_WIDTH <= plotWidth) return right;
  const left = hoverX - TOOLTIP_GAP - TOOLTIP_WIDTH;
  if (left >= 0) return left;
  return Math.min(right, maxLeft);
}

// ── Dark tooltip (matches analytics) ────────────────────────────────

function ChartTooltipDark({
  label,
  rows,
}: {
  label: string;
  rows: { key: string; label: string; color: string; value: string }[];
}) {
  return (
    <div
      className="w-[200px] rounded-lg p-1 font-inter"
      style={{
        backgroundColor: "#151515",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05))",
      }}
    >
      <div className="flex flex-col p-1">
        <p className="pb-1.5 text-xs font-normal leading-tight text-white/60">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div
              className="flex items-center justify-between gap-2"
              key={row.key}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="inline-block size-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: row.color }}
                />
                <span className="truncate text-xs font-normal leading-tight text-white">
                  {row.label}
                </span>
              </div>
              <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-normal leading-tight text-white tabular-nums">
                {row.value || "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Gradient offset helpers ─────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function pct(v: number, total: number) {
  if (total <= 0) return "0%";
  return `${(clamp(v, 0, total) / total) * 100}%`;
}

// ── Line Chart ───────────────────────────────────────────────────────

interface LineChartProps {
  data: ChartDataPoint[];
  series: ChartSeries[];
  heightClassName?: string;
  className?: string;
  visibleKeys?: string[];
  formatValue?: ChartTooltipFormatter;
  showGrid?: boolean;
  curve?: "monotone" | "linear" | "natural";
  onPointClick?: (index: number, label: string) => void;
  /** Y-axis label strings (top to bottom). If omitted recharts auto-labels. */
  yLabels?: string[];
  /** X-axis tick labels. If omitted uses data[].label evenly. */
  xTicks?: { index: number; label: string }[];
}

export function LineChart({
  data,
  series,
  heightClassName = "h-[300px]",
  className,
  visibleKeys,
  formatValue,
  showGrid = false,
  curve = "natural",
  onPointClick,
  yLabels,
  xTicks,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, "");
  const focusGradientId = useId().replace(/:/g, "");

  const activeSeries = useMemo(
    () =>
      visibleKeys
        ? series.filter((s) => visibleKeys.includes(s.key))
        : series,
    [series, visibleKeys],
  );

  const hasRightAxis = activeSeries.some((s) => s.axis === "right");

  const { hover, onMouseMove, onMouseLeave } = useChartHover(
    containerRef,
    data,
    activeSeries.length > 0,
  );

  const plotWidth = plotRef.current?.clientWidth ?? 0;
  const hoverX = hover && plotWidth > 0 ? clamp(hover.x, 0, plotWidth) : undefined;
  const tooltipLeft = resolveTooltipLeft(hoverX, plotWidth);

  // Build tooltip rows
  const tooltipRows = useMemo(() => {
    if (!hover) return [];
    const pt = data[hover.index];
    if (!pt) return [];
    return activeSeries.map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      value: formatValue
        ? formatValue(Number(pt[s.key]) || 0, s.key, pt)
        : (Number(pt[s.key]) || 0).toLocaleString(),
    }));
  }, [hover, data, activeSeries, formatValue]);

  const showHover = Boolean(
    hover && hoverX !== undefined && tooltipLeft !== undefined && tooltipRows.length > 0,
  );

  // Focus gradient offsets
  const focusCenterX = showHover && hoverX !== undefined ? hoverX : undefined;
  const leftFadeStart = focusCenterX !== undefined ? pct(focusCenterX - FOCUS_TOTAL_HALF, plotWidth) : "0%";
  const leftFadeEnd = focusCenterX !== undefined ? pct(focusCenterX - FOCUS_CORE_HALF, plotWidth) : "0%";
  const rightFadeStart = focusCenterX !== undefined ? pct(focusCenterX + FOCUS_CORE_HALF, plotWidth) : "0%";
  const rightFadeEnd = focusCenterX !== undefined ? pct(focusCenterX + FOCUS_TOTAL_HALF, plotWidth) : "0%";
  const shouldRenderFocus = focusCenterX !== undefined;

  // Compute x-ticks from data if not provided
  const resolvedXTicks = useMemo(() => {
    if (xTicks) return xTicks;
    return data.map((d, i) => ({ index: i, label: d.label }));
  }, [xTicks, data]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", heightClassName, className)}
    >
      <div className="absolute inset-x-0 bottom-6 top-0 flex items-end gap-3">
        {/* Custom Y-axis labels */}
        {yLabels && (
          <div className="relative h-full w-5 shrink-0">
            <div className="absolute inset-0 flex flex-col items-end justify-between">
              {yLabels.map((label, i) => (
                <span
                  className="font-inter text-[10px] font-normal leading-tight text-page-text-muted"
                  key={`y-${i}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Chart plot area */}
        <div className="relative h-full min-h-0 flex-1" ref={plotRef}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{ top: 0, right: 0, bottom: 2, left: 0 }}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onClick={(state) => {
                if (onPointClick && state?.activeTooltipIndex != null) {
                  const idx = Number(state.activeTooltipIndex);
                  onPointClick(idx, data[idx]?.label ?? "");
                }
              }}
              style={onPointClick ? { cursor: "pointer" } : undefined}
            >
              {/* Hidden axes for layout */}
              <XAxis
                dataKey={yLabels ? "index" : "label"}
                domain={yLabels ? [0, data.length - 1] : undefined}
                type={yLabels ? "number" : undefined}
                hide={!!yLabels}
                tick={yLabels ? false : AXIS_TICK_STYLE}
                tickLine={false}
                axisLine={false}
                dy={8}
              />

              <YAxis
                yAxisId="left"
                hide={!!yLabels}
                tick={yLabels ? false : AXIS_TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={yLabels ? 0 : 44}
              />

              {hasRightAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  hide={!!yLabels}
                  tick={yLabels ? false : AXIS_TICK_STYLE}
                  tickLine={false}
                  axisLine={false}
                  width={yLabels ? 0 : 44}
                />
              )}

              {showGrid && (
                <CartesianGrid
                  strokeDasharray={GRID_DASH}
                  stroke={GRID_STROKE}
                  strokeOpacity={0.5}
                  vertical={false}
                />
              )}

              {/* Invisible tooltip to keep recharts tracking */}
              <RechartsTooltip
                content={() => null}
                cursor={false}
                isAnimationActive={false}
                wrapperStyle={{ display: "none" }}
              />

              {/* Gradient defs */}
              <defs>
                {activeSeries.map((s) => [
                  /* Horizontal start-fade gradient */
                  <linearGradient
                    key={`${gradientId}-${s.key}`}
                    id={`${gradientId}-${s.key}`}
                    x1="0" y1="0" x2="1" y2="0"
                  >
                    <stop offset="0%" stopColor={s.color} stopOpacity={LINE_START_FADE_OPACITY} />
                    <stop offset={LINE_START_FADE_END} stopColor={s.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={1} />
                  </linearGradient>,
                  /* Hover focus gradient */
                  <linearGradient
                    key={`${focusGradientId}-${s.key}`}
                    id={`${focusGradientId}-${s.key}`}
                    x1="0" y1="0" x2="1" y2="0"
                  >
                    <stop offset="0%" stopColor={s.color} stopOpacity={0} />
                    <stop offset={leftFadeStart} stopColor={s.color} stopOpacity={0} />
                    <stop offset={leftFadeEnd} stopColor={s.color} stopOpacity={1} />
                    <stop offset={rightFadeStart} stopColor={s.color} stopOpacity={1} />
                    <stop offset={rightFadeEnd} stopColor={s.color} stopOpacity={0} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>,
                ])}
              </defs>

              {/* Render two layers per series: base (dimmed on hover) + focus (bright on hover) */}
              {activeSeries.flatMap((s) => {
                const baseStroke = shouldRenderFocus ? s.color : `url(#${gradientId}-${s.key})`;
                const baseOpacity = shouldRenderFocus ? HOVER_DIM_OPACITY : 1;
                const focusOpacity = shouldRenderFocus ? 1 : 0;

                return [
                  <Line
                    key={`${s.key}-base`}
                    yAxisId={s.axis ?? "left"}
                    type={curve}
                    dataKey={s.key}
                    stroke={baseStroke}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity={baseOpacity}
                    dot={false}
                    activeDot={false}
                    isAnimationActive
                    animationDuration={450}
                    animationEasing="ease-out"
                    style={{
                      transition: `stroke-opacity ${TRANSITION_MS}ms ${HOVER_EASING}`,
                    }}
                  />,
                  <Line
                    key={`${s.key}-focus`}
                    yAxisId={s.axis ?? "left"}
                    type={curve}
                    dataKey={s.key}
                    stroke={`url(#${focusGradientId}-${s.key})`}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity={focusOpacity}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                    style={{
                      transition: `stroke-opacity ${TRANSITION_MS}ms ${HOVER_EASING}`,
                    }}
                  />,
                ];
              })}
            </RechartsLineChart>
          </ResponsiveContainer>

          {/* Tooltip overlay */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10"
            style={{
              opacity: showHover ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            <div
              className="absolute top-2"
              style={{
                left: tooltipLeft ?? 0,
                transition: `left 120ms ${HOVER_EASING}`,
              }}
            >
              <ChartTooltipDark label={hover?.label ?? ""} rows={tooltipRows} />
            </div>
          </div>
        </div>
      </div>

      {/* Crosshair line */}
      <div
        className="pointer-events-none absolute top-0 right-0"
        style={{
          bottom: 24,
          left: yLabels ? 32 : 0,
        }}
      >
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: hoverX ?? 0,
            width: 0,
            borderLeft: "1px solid var(--foreground)",
            opacity: showHover && hoverX !== undefined ? 0.15 : 0,
            transition: `left 100ms ${HOVER_EASING}, opacity 100ms ease-out`,
          }}
        />
      </div>

      {/* X-axis labels + hover date pill */}
      <div
        className="absolute bottom-0 right-0 flex h-6 items-center justify-between gap-2"
        style={{ left: yLabels ? 32 : 0 }}
      >
        {resolvedXTicks.map((tick) => (
          <span
            className="font-inter text-[10px] font-normal leading-tight tracking-wide text-page-text-muted"
            key={`x-${tick.index}-${tick.label}`}
          >
            {tick.label}
          </span>
        ))}

        {/* Hover date pill */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 flex items-center justify-center"
          style={{
            left: hoverX ?? 0,
            transform: "translateX(-50%)",
            opacity: showHover ? 1 : 0,
            transition: `left 100ms ${HOVER_EASING}, opacity 100ms ease-out`,
          }}
        >
          <span className="whitespace-nowrap rounded-full border border-border bg-card-bg px-2.5 py-1 font-inter text-[10px] font-medium leading-tight tracking-wide text-page-text-muted">
            {hover?.label ?? ""}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Simple Tooltip (used by BarChart) ────────────────────────────────

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[];
  series: ChartSeries[];
  formatValue?: ChartTooltipFormatter;
}

function ChartTooltip({
  active,
  payload,
  label,
  series,
  formatValue,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <motion.div
      className="pointer-events-none rounded-xl border border-border bg-card-bg px-3 py-2.5 shadow-lg"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="mb-1.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => {
          const s = series.find((s) => s.key === entry.dataKey);
          const formatted = formatValue
            ? formatValue(entry.value, entry.dataKey, entry.payload)
            : entry.value.toLocaleString();

          return (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: s?.color ?? entry.color }}
              />
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                {s?.label ?? entry.name}
              </span>
              <span className="ml-auto font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {formatted}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Bar Chart ────────────────────────────────────────────────────────

interface BarChartProps {
  data: ChartDataPoint[];
  series: ChartSeries[];
  heightClassName?: string;
  className?: string;
  visibleKeys?: string[];
  formatValue?: ChartTooltipFormatter;
  showGrid?: boolean;
  stacked?: boolean;
  maxBarSize?: number;
  onBarClick?: (index: number, label: string) => void;
}

export function BarChart({
  data,
  series,
  heightClassName = "h-[300px]",
  className,
  visibleKeys,
  formatValue,
  showGrid = true,
  stacked = false,
  maxBarSize = 34,
  onBarClick,
}: BarChartProps) {
  const activeSeries = useMemo(
    () =>
      visibleKeys
        ? series.filter((s) => visibleKeys.includes(s.key))
        : series,
    [series, visibleKeys],
  );

  return (
    <div className={cn("w-full", heightClassName, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onClick={(state) => {
            if (onBarClick && state?.activeTooltipIndex != null) {
              const idx = Number(state.activeTooltipIndex);
              onBarClick(idx, data[idx]?.label ?? "");
            }
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray={GRID_DASH}
              stroke={GRID_STROKE}
              strokeOpacity={0.5}
              vertical={false}
            />
          )}

          <XAxis
            dataKey="label"
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            axisLine={false}
            dy={8}
          />

          <YAxis
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={44}
          />

          <RechartsTooltip
            content={(props) => (
              <ChartTooltip
                {...props}
                series={activeSeries}
                formatValue={formatValue}
              />
            )}
            cursor={{
              fill: "currentColor",
              opacity: 0.04,
              radius: 0,
            }}
          />

          {activeSeries.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={s.color}
              maxBarSize={maxBarSize}
              stackId={stacked ? "stack" : undefined}
              radius={
                stacked && i < activeSeries.length - 1
                  ? [0, 0, 0, 0]
                  : [4, 4, 0, 0]
              }
              animationDuration={400}
              animationEasing="ease-out"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Mini Sparkline ───────────────────────────────────────────────────

let sparklineIdCounter = 0;

interface SparklineProps {
  values?: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  values,
  color = "#00B259",
  width = 64,
  height = 28,
  className,
}: SparklineProps) {
  const [gradId] = useState(() => `sparkline-grad-${++sparklineIdCounter}`);

  const data = useMemo(() => {
    if (values?.length) return values;
    const pts = 12;
    const arr: number[] = [];
    let v = 40 + Math.random() * 20;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.45) * 15;
      v = Math.max(5, Math.min(95, v));
      arr.push(v);
    }
    return arr;
  }, [values]);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${pad},${height - pad} ${points} ${width - pad},${height - pad}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Chart Legend ─────────────────────────────────────────────────────

interface ChartLegendProps {
  series: ChartSeries[];
  visibleKeys?: string[];
  onToggle?: (key: string) => void;
  className?: string;
}

export function ChartLegend({
  series,
  visibleKeys,
  onToggle,
  className,
}: ChartLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {series.map((s) => {
        const isVisible = !visibleKeys || visibleKeys.includes(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onToggle?.(s.key)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 font-inter text-xs tracking-[-0.02em] transition-opacity",
              isVisible ? "opacity-100" : "opacity-40",
            )}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-page-text-muted">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
