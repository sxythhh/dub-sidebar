"use client";
import { PageShell } from "@/components/page-shell";

export default function AnalyticsPage() {
  return (
    <PageShell title="Analytics" description="Track clicks, conversions, and revenue across all your links.">
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total clicks", value: "12,847", change: "+14.2%" },
          { label: "Unique visitors", value: "8,234", change: "+9.8%" },
          { label: "Conversions", value: "342", change: "+23.1%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 p-4">
            <div className="text-sm text-neutral-500">{stat.label}</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">{stat.value}</div>
            <div className="mt-1 text-xs font-medium text-green-600">{stat.change} vs last period</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-400">
        Chart placeholder
      </div>
    </PageShell>
  );
}
