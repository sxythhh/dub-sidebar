"use client";
import { PageShell } from "@/components/page-shell";

const CUSTOMERS = [
  { id: 1, name: "Alice Chen", email: "alice@company.com", events: 47, revenue: "$2,340", lastSeen: "1h ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" },
  { id: 2, name: "Bob Smith", email: "bob@startup.io", events: 23, revenue: "$890", lastSeen: "3h ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
  { id: 3, name: "Clara Davis", email: "clara@agency.co", events: 15, revenue: "$450", lastSeen: "1d ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
  { id: 4, name: "Dan Wilson", email: "dan@corp.com", events: 8, revenue: "$120", lastSeen: "2d ago", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face" },
];

export default function CustomersPage() {
  return (
    <PageShell title="Customers" description="Track customers across the entire conversion funnel.">
      <div className="mt-4 rounded-lg border border-border">
        {/* Desktop table */}
        <div className="hidden divide-y divide-border sm:block">
          <div className="grid grid-cols-[40px_1fr_1fr_80px_100px_80px] gap-3 px-4 py-2 text-xs font-medium text-page-text-muted">
            <span></span>
            <span>Name</span>
            <span>Email</span>
            <span>Events</span>
            <span>Revenue</span>
            <span className="text-right">Last seen</span>
          </div>
          {CUSTOMERS.map((c) => (
            <div key={c.id} className="grid grid-cols-[40px_1fr_1fr_80px_100px_80px] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent">
              <img src={c.avatar} alt="" className="size-8 rounded-full object-cover" />
              <span className="font-medium text-page-text">{c.name}</span>
              <span className="text-page-text-muted">{c.email}</span>
              <span className="text-page-text-muted">{c.events}</span>
              <span className="font-medium text-page-text">{c.revenue}</span>
              <span className="text-right text-page-text-muted">{c.lastSeen}</span>
            </div>
          ))}
        </div>
        {/* Mobile list */}
        <div className="divide-y divide-border sm:hidden">
          {CUSTOMERS.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3">
              <img src={c.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-page-text">{c.name}</span>
                  <span className="shrink-0 text-sm font-medium text-page-text">{c.revenue}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <span className="truncate text-xs text-page-text-muted">{c.email}</span>
                  <span className="shrink-0 text-xs text-page-text-muted">{c.lastSeen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
