"use client";

import type { AffiliateCode, AffiliateMetrics } from "@/types/affiliate.types";
import { MoneyBagIcon, BellIcon, ClickIcon, UsersGroupIcon } from "./icons";
import { glassCard } from "./styles";

interface StatsCardsProps {
  metrics: AffiliateMetrics;
  codes: AffiliateCode[];
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex flex-col justify-center flex-1 min-w-0"
      style={{ ...glassCard, gap: 12, padding: 16 }}
    >
      <div className="flex items-center" style={{ gap: 6 }}>
        {icon}
        <span
          className="text-sm"
          style={{
            color: "var(--af-text-secondary)",
            letterSpacing: "-0.09px",
            lineHeight: "120%",
          }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xl font-medium"
        style={{
          color: "var(--af-text)",
          letterSpacing: "-0.33px",
          lineHeight: "120%",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
}

export function StatsCards({ metrics, codes }: StatsCardsProps) {
  const activeCodes = codes.filter((c) => c.isActive).length;

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 self-stretch"
      style={{ gap: 8 }}
    >
      <StatCard
        icon={
          <MoneyBagIcon
            size={16}
            color="var(--af-text-muted)"
          />
        }
        label="Total Earnings"
        value={formatCurrency(metrics.totalEarnings)}
      />
      <StatCard
        icon={<UsersGroupIcon color="var(--af-text-muted)" size={16} />}
        label="Clippers Referred"
        value={metrics.totalReferrals.toLocaleString()}
      />
      <StatCard
        icon={<ClickIcon color="var(--af-text-muted)" size={16} />}
        label="Total Clicks"
        value={metrics.totalClicks.toLocaleString()}
      />
      <StatCard
        icon={<BellIcon color="var(--af-text-muted)" size={16} />}
        label="Active Codes"
        value={activeCodes.toLocaleString()}
      />
    </div>
  );
}
