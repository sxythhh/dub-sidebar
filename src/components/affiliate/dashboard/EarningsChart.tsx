"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  AffiliateChartPoint,
  AffiliateTimeframe,
} from "@/types/affiliate.types";
import { TIMEFRAME_LABELS } from "@/types/affiliate.types";
import { UsersGroupIcon } from "./icons";
import { glassCard } from "./styles";

interface EarningsChartProps {
  chart: AffiliateChartPoint[];
  timeframe: AffiliateTimeframe;
  onTimeframeChange: (tf: AffiliateTimeframe) => void;
}

const TIMEFRAMES: AffiliateTimeframe[] = ["today", "week", "month", "lifetime"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function EarningsChart({
  chart,
  timeframe,
  onTimeframeChange,
}: EarningsChartProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const hasData = chart.length >= 2;

  return (
    <div
      className="flex flex-col flex-1 min-w-0"
      style={{ ...glassCard, gap: 16, padding: 16 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 6 }}>
          <UsersGroupIcon color="var(--af-text-muted)" size={16} />
          <span
            className="text-sm"
            style={{
              color: "var(--af-text-secondary)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
            }}
          >
            Earnings over time
          </span>
        </div>

        {/* Timeframe dropdown */}
        <div className="relative">
          <button
            className="flex items-center"
            onClick={() => setOpenDropdown((o) => !o)}
            style={{
              backgroundColor: "var(--af-bg-input)",
              border: "none",
              borderRadius: 999,
              color: "var(--af-text-secondary)",
              fontSize: 12,
              gap: 4,
              padding: "4px 12px",
            }}
            type="button"
          >
            {TIMEFRAME_LABELS[timeframe]}
          </button>
          {openDropdown && (
            <div
              className="absolute right-0 top-full mt-1 flex flex-col z-10"
              style={{
                backgroundColor: "var(--af-bg-dropdown)",
                border: "1px solid var(--af-border-subtle)",
                borderRadius: 8,
                boxShadow: "var(--af-shadow-card)",
                minWidth: 140,
                overflow: "hidden",
              }}
            >
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    onTimeframeChange(tf);
                    setOpenDropdown(false);
                  }}
                  style={{
                    backgroundColor:
                      tf === timeframe ? "var(--af-hover)" : "transparent",
                    border: "none",
                    color: "var(--af-text-secondary)",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "8px 12px",
                    textAlign: "left",
                  }}
                  type="button"
                >
                  {TIMEFRAME_LABELS[tf]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart body */}
      {hasData ? (
        <div style={{ height: 220, width: "100%" }}>
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={chart}
              margin={{ bottom: 0, left: -20, right: 4, top: 4 }}
            >
              <defs>
                <linearGradient id="clicksGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#9D5AEF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#9D5AEF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="referralsGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#55B685" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#55B685" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--af-divider)"
                strokeDasharray="none"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{
                  fill: "var(--af-text-faint)",
                  fontSize: 10,
                }}
                tickFormatter={formatDate}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{
                  fill: "var(--af-text-faint)",
                  fontSize: 10,
                }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--af-bg-dropdown)",
                  border: "1px solid var(--af-border-subtle)",
                  borderRadius: 8,
                  boxShadow: "var(--af-shadow-card)",
                  color: "var(--af-text)",
                  fontSize: 12,
                }}
              />
              <Area
                dataKey="clicks"
                fill="url(#clicksGrad)"
                name="Clicks"
                stroke="#9D5AEF"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="referrals"
                fill="url(#referralsGrad)"
                name="Referrals"
                stroke="#55B685"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          className="flex items-center justify-center"
          style={{
            color: "var(--af-text-faint)",
            fontSize: 14,
            height: 220,
          }}
        >
          Not enough data to display chart
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center" style={{ gap: 16 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <div
            style={{
              backgroundColor: "#9D5AEF",
              borderRadius: 4,
              height: 8,
              width: 8,
            }}
          />
          <span className="text-xs" style={{ color: "var(--af-text-muted)" }}>
            Clicks
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <div
            style={{
              backgroundColor: "#55B685",
              borderRadius: 4,
              height: 8,
              width: 8,
            }}
          />
          <span className="text-xs" style={{ color: "var(--af-text-muted)" }}>
            Referrals
          </span>
        </div>
      </div>
    </div>
  );
}
