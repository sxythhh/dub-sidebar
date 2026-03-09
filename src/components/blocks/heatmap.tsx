"use client";

import { useMemo, useState, useCallback, useRef, useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type HeatmapDataPoint = {
  date: string;
  value: number;
};

export type HeatmapData = HeatmapDataPoint[];

export type HeatmapColorMode = "opacity" | "interpolate";

interface HeatmapProps {
  data: HeatmapData;
  startDate: Date;
  endDate: Date;
  color?: string;
  colorScale?: string[];
  colorMode?: HeatmapColorMode;
  cellRadius?: number;
  cellGap?: number;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  tooltipFormatter?: (point: HeatmapDataPoint) => string;
  legend?: { left: string; right: string };
  footer?: React.ReactNode;
  className?: string;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CELL_SIZE = 14;
const DEFAULT_GAP = 3;
const DEFAULT_RADIUS = 3;
const MONTH_LABEL_HEIGHT = 14;
const LABEL_FONT_SIZE = 8;

const DEFAULT_COLOR_SCALE = [
  "var(--ap-hover)",
  "rgba(22, 163, 74, 0.25)",
  "rgba(22, 163, 74, 0.50)",
  "rgba(22, 163, 74, 0.75)",
  "rgb(22, 163, 74)",
];

function getWeeksBetween(start: Date, end: Date): number {
  const startSunday = new Date(start);
  startSunday.setUTCDate(startSunday.getUTCDate() - startSunday.getUTCDay());
  const endSunday = new Date(end);
  endSunday.setUTCDate(endSunday.getUTCDate() - endSunday.getUTCDay());
  const diffMs = endSunday.getTime() - startSunday.getTime();
  return Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function dateToKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatTooltipDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function interpolateColor(
  value: number,
  maxValue: number,
  scale: string[],
): string {
  if (maxValue === 0 || value === 0) return scale[0];
  const ratio = Math.min(value / maxValue, 1);
  const idx = Math.round(ratio * (scale.length - 1));
  return scale[idx];
}

interface CellData {
  date: string;
  value: number;
  week: number;
  day: number;
  color: string;
}

// Global dismiss — ensures only one heatmap tooltip is visible at a time
let globalDismiss: (() => void) | null = null;

export default function Heatmap({
  data,
  startDate,
  endDate,
  color,
  colorScale,
  colorMode = "interpolate",
  cellRadius = DEFAULT_RADIUS,
  cellGap = DEFAULT_GAP,
  showMonthLabels = true,
  showDayLabels = true,
  tooltipFormatter,
  legend,
  footer,
  className,
}: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    cell: CellData;
    x: number;
    y: number;
  } | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = useMemo(() => {
    if (colorScale) return colorScale;
    if (color) {
      return [
        "var(--ap-hover)",
        `color-mix(in srgb, ${color} 25%, transparent)`,
        `color-mix(in srgb, ${color} 50%, transparent)`,
        `color-mix(in srgb, ${color} 75%, transparent)`,
        color,
      ];
    }
    return DEFAULT_COLOR_SCALE;
  }, [color, colorScale]);

  const { cells, monthLabels, maxValue } = useMemo(() => {
    const lookup = new Map<string, number>();
    let max = 0;
    for (const d of data) {
      lookup.set(d.date, d.value);
      if (d.value > max) max = d.value;
    }

    const startSunday = new Date(startDate);
    startSunday.setUTCDate(startSunday.getUTCDate() - startSunday.getUTCDay());

    const result: CellData[] = [];
    const months: { label: string; week: number }[] = [];
    let lastMonth = -1;

    const current = new Date(startSunday);
    const endTime = endDate.getTime();
    let weekIdx = 0;

    while (current.getTime() <= endTime || current.getUTCDay() !== 0) {
      const key = dateToKey(current);
      const dayOfWeek = current.getUTCDay();
      const value = lookup.get(key) ?? 0;

      const inRange =
        current.getTime() >= startDate.getTime() &&
        current.getTime() <= endTime;

      if (inRange) {
        const cellColor =
          colorMode === "interpolate"
            ? interpolateColor(value, max, scale)
            : value === 0
              ? scale[0]
              : `${scale[scale.length - 1]}`;

        result.push({
          date: key,
          value,
          week: weekIdx,
          day: dayOfWeek,
          color:
            colorMode === "opacity" && value > 0
              ? cellColor
              : cellColor,
        });

        const month = current.getUTCMonth();
        if (month !== lastMonth) {
          months.push({
            label: new Intl.DateTimeFormat("en-US", {
              month: "short",
              timeZone: "UTC",
            }).format(current),
            week: weekIdx,
          });
          lastMonth = month;
        }
      }

      current.setUTCDate(current.getUTCDate() + 1);
      if (dayOfWeek === 6) weekIdx++;

      if (current.getTime() > endTime + 7 * 24 * 60 * 60 * 1000) break;
    }

    return { cells: result, monthLabels: months, maxValue: max };
  }, [data, startDate, endDate, scale, colorMode]);

  const totalWeeks = getWeeksBetween(startDate, endDate);
  const dayLabelWidth = showDayLabels ? 28 : 0;
  const gridWidth = totalWeeks * (CELL_SIZE + cellGap) - cellGap;
  const gridHeight = 7 * (CELL_SIZE + cellGap) - cellGap;
  const legendHeight = legend ? 24 : 0;
  const totalWidth = dayLabelWidth + gridWidth;
  const totalHeight = (showMonthLabels ? MONTH_LABEL_HEIGHT : 0) + gridHeight + legendHeight;

  const dismiss = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = null;
    setTooltip(null);
  }, []);

  const handleMouseEnter = useCallback(
    (cell: CellData, e: React.MouseEvent) => {
      if (globalDismiss && globalDismiss !== dismiss) {
        globalDismiss();
      }
      globalDismiss = dismiss;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setTooltip({
        cell,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [dismiss],
  );

  const handleMouseLeave = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setTooltip(null);
      if (globalDismiss === dismiss) globalDismiss = null;
    }, 100);
  }, [dismiss]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (globalDismiss === dismiss) globalDismiss = null;
    };
  }, [dismiss]);

  const opacityStyle = useMemo((): CSSProperties | undefined => {
    if (colorMode !== "opacity") return undefined;
    return { opacity: 1 };
  }, [colorMode]);

  return (
    <div ref={containerRef} className={cn("relative overflow-visible", className)}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="block w-full"
        onMouseLeave={handleMouseLeave}
      >
        {showMonthLabels &&
          monthLabels.map((m) => (
            <text
              key={`${m.label}-${m.week}`}
              x={dayLabelWidth + m.week * (CELL_SIZE + cellGap)}
              y={LABEL_FONT_SIZE + 2}
              fontSize={LABEL_FONT_SIZE}
              style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", fill: "var(--ap-text-tertiary)" }}
            >
              {m.label}
            </text>
          ))}

        {showDayLabels &&
          DAY_LABELS.map((label, i) => (
            <text
              key={`day-${i}`}
              x={dayLabelWidth - 24}
              y={
                (showMonthLabels ? MONTH_LABEL_HEIGHT : 0) +
                i * (CELL_SIZE + cellGap) +
                CELL_SIZE * 0.75
              }
              fontSize={LABEL_FONT_SIZE}
              style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", fill: "var(--ap-text-tertiary)" }}
            >
              {label}
            </text>
          ))}

        {cells.map((cell) => {
          const x = dayLabelWidth + cell.week * (CELL_SIZE + cellGap);
          const y =
            (showMonthLabels ? MONTH_LABEL_HEIGHT : 0) +
            cell.day * (CELL_SIZE + cellGap);

          return (
            <rect
              key={cell.date}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={cellRadius}
              ry={cellRadius}
              fill={cell.color}
              style={
                colorMode === "opacity" && cell.value > 0
                  ? { opacity: Math.max(0.15, cell.value / maxValue) }
                  : opacityStyle
              }
              className="transition-colors duration-75"
              onMouseEnter={(e) => handleMouseEnter(cell, e)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {legend && (() => {
          const legendY = (showMonthLabels ? MONTH_LABEL_HEIGHT : 0) + gridHeight + 12;
          const legendBlockSize = 10;
          const legendBlockGap = 2;
          const legendTextOffset = 24;
          const legendBlocksWidth = scale.length * (legendBlockSize + legendBlockGap) - legendBlockGap;

          return (
            <>
              <text
                x={dayLabelWidth - legendTextOffset}
                y={legendY + legendBlockSize * 0.8}
                fontSize={LABEL_FONT_SIZE}
                textAnchor="start"
                style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", fill: "var(--ap-text-tertiary)" }}
              >
                {legend.left}
              </text>
              {scale.map((c, i) => (
                <rect
                  key={`legend-${i}`}
                  x={dayLabelWidth + i * (legendBlockSize + legendBlockGap)}
                  y={legendY}
                  width={legendBlockSize}
                  height={legendBlockSize}
                  rx={2}
                  ry={2}
                  fill={c}
                />
              ))}
              <text
                x={dayLabelWidth + legendBlocksWidth + 6}
                y={legendY + legendBlockSize * 0.8}
                fontSize={LABEL_FONT_SIZE}
                style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", fill: "var(--ap-text-tertiary)" }}
              >
                {legend.right}
              </text>
            </>
          );
        })()}
      </svg>

      {tooltip && createPortal(
        <div
          className="pointer-events-none fixed whitespace-nowrap rounded-[8px] px-2.5 py-1.5 font-inter text-[12px] leading-[1.4] text-white"
          style={{
            left: tooltip.x,
            top: tooltip.y - 48,
            transform: "translateX(-50%)",
            zIndex: 9999,
            backgroundColor: "#212121",
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05))",
          }}
        >
          {tooltipFormatter
            ? tooltipFormatter(tooltip.cell)
            : `${tooltip.cell.value} events on ${formatTooltipDate(tooltip.cell.date)}`}
        </div>,
        document.body,
      )}

      {footer && (
        <div style={{ paddingLeft: `${((dayLabelWidth - LABEL_FONT_SIZE) / totalWidth) * 100}%` }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export { Heatmap };
