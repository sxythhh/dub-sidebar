"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Helpers ── */

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const RANGE_BG =
  "radial-gradient(42.53% 86.44% at 50.57% 0%, var(--toggle-glow) 0%, var(--toggle-track) 100%)";

/** Input trigger — default state (inline required for Tailwind v4 button preflight) */
const INPUT_BG: React.CSSProperties = {
  backgroundColor: "var(--glass-surface)",
  backgroundImage:
    "radial-gradient(33.86% 79.61% at 50.57% 0%, var(--glass-subtle) 0%, oklch(1 0 0 / 0.006) 100%)",
};

/** Input trigger — active/selected state (inline required for Tailwind v4 button preflight) */
const ACTIVE_BG: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(60.93% 50% at 51.43% 0%, var(--glass-highlight) 0%, transparent 100%)",
    "linear-gradient(0deg, var(--glass-tint), var(--glass-tint))",
    "radial-gradient(33.86% 79.61% at 50.57% 0%, var(--glass-subtle) 0%, transparent 100%)",
  ].join(", "),
  backgroundColor: "var(--glass-surface)",
  boxShadow: "inset 0 0 0 2px var(--glass-ring)",
};

/** Selected day cell (inline required for Tailwind v4 button preflight) */
const SELECTED_DAY: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(31.76% 50.52% at 64.86% 100.52%, var(--accent-pink) 0%, transparent 100%)",
    "radial-gradient(31.58% 54.43% at 32.86% 102.32%, var(--accent-orange) 0%, transparent 100%)",
  ].join(", "),
  backgroundColor: "var(--foreground)",
  color: "var(--background)",
};

interface DayCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  dateStr: string;
}

function getMonthGrid(year: number, month: number): DayCell[][] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const dow = cells.length % 7;
    cells.push({
      day: d, month: m, year: y, isCurrentMonth: false,
      isWeekend: dow >= 5, isToday: false,
      dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = cells.length % 7;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      day: d, month, year, isCurrentMonth: true,
      isWeekend: dow >= 5, isToday: dateStr === todayStr, dateStr,
    });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const dow = cells.length % 7;
      cells.push({
        day: d, month: nm, year: ny, isCurrentMonth: false,
        isWeekend: dow >= 5, isToday: false,
        dateStr: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function formatDisplay(value: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return `${d} ${MONTH_SHORT[m - 1]}, ${y}`;
}

/* ── CalendarGrid (internal) ── */

interface CalendarGridProps {
  startDate: string;
  endDate: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  onClose: () => void;
}

function CalendarGrid({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  onClose,
}: CalendarGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState<"start" | "end">(
    startDate ? "end" : "start",
  );
  const [hovered, setHovered] = useState<string | null>(null);

  const initial = useMemo(() => {
    const d = startDate || endDate;
    if (d) {
      const [y, m] = d.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [startDate, endDate]);

  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);

  useEffect(() => {
    setSelecting(startDate ? "end" : "start");
  }, [startDate]);

  const weeks = useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const goBack = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goForward = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const handleDayClick = useCallback(
    (dateStr: string) => {
      if (selecting === "start") {
        onChangeStart(dateStr);
        if (endDate && dateStr > endDate) onChangeEnd("");
        setSelecting("end");
      } else {
        if (startDate && dateStr < startDate) {
          onChangeStart(dateStr);
          onChangeEnd("");
          setSelecting("end");
        } else {
          onChangeEnd(dateStr);
          onClose();
        }
      }
    },
    [selecting, startDate, endDate, onChangeStart, onChangeEnd, onClose],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const effectiveEnd =
    selecting === "end" && hovered && startDate && hovered >= startDate
      ? hovered
      : endDate;

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-50 flex min-w-[336px] w-[336px] flex-col rounded-2xl overflow-hidden shadow-lg shadow-black/40"
      style={{ backgroundColor: "#151515", border: "1px solid rgba(255, 255, 255, 0.15)" }}
    >
      {/* Month nav header */}
      <div className="flex h-10 items-center justify-center gap-8 px-2.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>

        <button
          type="button"
          onClick={goBack}
          className="flex size-5 items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        >
          <ChevronLeft size={12} className="text-text-dim" />
        </button>
        <span className="flex-1 text-center text-sm font-medium leading-[120%] tracking-[-0.09px] text-text-dim whitespace-nowrap">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goForward}
          className="flex size-5 items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        >
          <ChevronRight size={12} className="text-text-dim" />
        </button>
      </div>

      {/* Calendar body */}
      <div className="flex flex-col gap-3 px-4 py-5">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[10px] font-medium leading-[120%] tracking-[-0.09px] text-text-dim"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex flex-col gap-2">
          {weeks.map((week, wi) => {
            const hasRange =
              startDate && effectiveEnd &&
              week.some((c) => c.dateStr >= startDate && c.dateStr <= effectiveEnd);
            let rangeStartIdx = -1;
            let rangeEndIdx = -1;
            if (hasRange) {
              for (let i = 0; i < week.length; i++) {
                if (week[i].dateStr >= startDate && week[i].dateStr <= effectiveEnd!) {
                  if (rangeStartIdx === -1) rangeStartIdx = i;
                  rangeEndIdx = i;
                }
              }
            }

            return (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {hasRange && rangeStartIdx !== -1 && (
                  <div
                    className="rounded-full self-center"
                    style={{
                      background: RANGE_BG,
                      height: 32,
                      gridRow: 1,
                      gridColumn: `${rangeStartIdx + 1} / ${rangeEndIdx + 2}`,
                    }}
                  />
                )}

                {week.map((cell, i) => {
                  const isStart = cell.dateStr === startDate;
                  const isEnd = cell.dateStr === effectiveEnd;
                  const isSelected = isStart || (isEnd && !!startDate);
                  const isInRange =
                    startDate && effectiveEnd &&
                    cell.dateStr > startDate && cell.dateStr < effectiveEnd;
                  const isHovered = cell.dateStr === hovered;

                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      onClick={() => handleDayClick(cell.dateStr)}
                      onMouseEnter={() => setHovered(cell.dateStr)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        gridRow: 1,
                        gridColumn: i + 1,
                        ...(isSelected ? SELECTED_DAY : cell.isToday ? { border: "1px solid #FFFFFF" } : isHovered && !isInRange ? { backgroundColor: "rgba(255, 255, 255, 0.08)" } : {}),
                      }}
                      className={cn(
                        "z-[1] flex size-8 items-center justify-center rounded-full text-sm font-medium leading-[120%] tracking-[-0.09px] transition-colors place-self-center",
                        !isSelected && !cell.isCurrentMonth
                          ? "text-text-faint"
                          : cell.isWeekend
                            ? "text-glass-text-secondary"
                            : "text-glass-text",
                      )}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── DateRangeInputs ── */

interface DateRangeInputsProps {
  startDate: string;
  endDate: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
}

function DateRangeInputs({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: DateRangeInputsProps) {
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<"start" | "end">("start");

  const openPicker = (field: "start" | "end") => {
    setActiveField(field);
    setOpen(true);
  };

  return (
    <div className="relative">
      <div className="flex gap-3">
        {/* Start date */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
          <span className="text-xs leading-[120%] text-glass-text-secondary">
            Start date
          </span>
          <button
            type="button"
            onClick={() => openPicker("start")}
            style={startDate ? ACTIVE_BG : INPUT_BG}
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-xl px-3 transition-colors",
              !startDate && "border border-glass-border",
            )}
          >
            <Calendar size={16} className="shrink-0" />
            <span
              className={cn(
                "flex-1 text-left text-sm leading-[120%] tracking-[-0.09px]",
                startDate ? "text-glass-text" : "text-text-muted",
              )}
            >
              {startDate ? formatDisplay(startDate) : "Select date"}
            </span>
          </button>
        </div>

        {/* End date */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
          <span className="text-xs leading-[120%] text-glass-text-secondary">
            End date
          </span>
          <button
            type="button"
            onClick={() => openPicker("end")}
            style={endDate ? ACTIVE_BG : INPUT_BG}
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-xl px-3 transition-colors",
              !endDate && "border border-glass-border",
            )}
          >
            <Calendar size={16} className="shrink-0" />
            <span
              className={cn(
                "flex-1 text-left text-sm leading-[120%] tracking-[-0.09px]",
                endDate ? "text-glass-text" : "text-text-muted",
              )}
            >
              {endDate ? formatDisplay(endDate) : "Select date"}
            </span>
          </button>
        </div>
      </div>

      {/* Calendar popup — anchored to the outer container, not individual inputs */}
      {open && (
        <CalendarGrid
          startDate={startDate}
          endDate={endDate}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/* ── DatePicker (single date, popover-triggered) ── */

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={value ? ACTIVE_BG : INPUT_BG}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-xl px-3 transition-colors",
          !value && "border border-glass-border",
        )}
      >
        <Calendar size={16} className="shrink-0" />
        <span
          className={cn(
            "flex-1 text-left text-sm leading-[120%] tracking-[-0.09px]",
            value ? "text-glass-text" : "text-text-muted",
          )}
        >
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <CalendarGrid
          startDate={value}
          endDate=""
          onChangeStart={onChange}
          onChangeEnd={() => {}}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export { DateRangeInputs, DatePicker };
