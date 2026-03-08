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
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        <div className="grid grid-cols-[40px_1fr_1fr_80px_100px_80px] gap-3 px-4 py-2 text-xs font-medium text-neutral-500">
          <span></span>
          <span>Name</span>
          <span>Email</span>
          <span>Events</span>
          <span>Revenue</span>
          <span className="text-right">Last seen</span>
        </div>
        {CUSTOMERS.map((c) => (
          <div key={c.id} className="grid grid-cols-[40px_1fr_1fr_80px_100px_80px] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-neutral-50">
            <img src={c.avatar} alt="" className="size-8 rounded-full object-cover" />
            <span className="font-medium text-neutral-900">{c.name}</span>
            <span className="text-neutral-500">{c.email}</span>
            <span className="text-neutral-600">{c.events}</span>
            <span className="font-medium text-neutral-900">{c.revenue}</span>
            <span className="text-right text-neutral-500">{c.lastSeen}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
