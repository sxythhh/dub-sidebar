"use client";
import { PageShell } from "@/components/page-shell";

const PARTNERS = [
  { id: 1, name: "Alice Chen", clicks: 1240, conversions: 89, revenue: "$4,230", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" },
  { id: 2, name: "Bob Smith", clicks: 890, conversions: 45, revenue: "$2,100", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
  { id: 3, name: "Clara Davis", clicks: 567, conversions: 23, revenue: "$1,050", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
];

export default function PartnersPage() {
  return (
    <PageShell title="All Partners" description="View and manage your affiliate partners.">
      <div className="mt-4 rounded-lg border border-border">
        {/* Desktop table */}
        <div className="hidden divide-y divide-border sm:block">
          <div className="grid grid-cols-[40px_1fr_80px_100px_100px] gap-3 px-4 py-2 text-xs font-medium text-page-text-muted">
            <span></span>
            <span>Partner</span>
            <span>Clicks</span>
            <span>Conversions</span>
            <span className="text-right">Revenue</span>
          </div>
          {PARTNERS.map((p) => (
            <div key={p.id} className="grid grid-cols-[40px_1fr_80px_100px_100px] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent">
              <img src={p.avatar} alt="" className="size-8 rounded-full object-cover" />
              <span className="font-medium text-page-text">{p.name}</span>
              <span className="text-page-text-muted">{p.clicks.toLocaleString()}</span>
              <span className="text-page-text-muted">{p.conversions}</span>
              <span className="text-right font-medium text-page-text">{p.revenue}</span>
            </div>
          ))}
        </div>
        {/* Mobile list */}
        <div className="divide-y divide-border sm:hidden">
          {PARTNERS.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <img src={p.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-page-text">{p.name}</span>
                  <span className="shrink-0 text-sm font-medium text-page-text">{p.revenue}</span>
                </div>
                <span className="mt-0.5 block text-xs text-page-text-muted">{p.clicks.toLocaleString()} clicks · {p.conversions} conversions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
