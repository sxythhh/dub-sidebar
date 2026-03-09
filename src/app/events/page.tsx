"use client";
import { PageShell } from "@/components/page-shell";
import { IconPointer } from "@tabler/icons-react";

const EVENTS = [
  { id: 1, type: "click", link: "dub.sh/launch", location: "San Francisco, US", device: "Chrome / macOS", time: "2 min ago" },
  { id: 2, type: "lead", link: "dub.sh/demo", location: "London, UK", device: "Safari / iOS", time: "5 min ago" },
  { id: 3, type: "sale", link: "dub.sh/launch", location: "Berlin, DE", device: "Firefox / Windows", time: "12 min ago", revenue: "$49.00" },
  { id: 4, type: "click", link: "dub.sh/docs", location: "Tokyo, JP", device: "Chrome / Android", time: "15 min ago" },
  { id: 5, type: "click", link: "dub.sh/blog", location: "Sydney, AU", device: "Safari / macOS", time: "23 min ago" },
  { id: 6, type: "lead", link: "dub.sh/launch", location: "Toronto, CA", device: "Chrome / Windows", time: "31 min ago" },
  { id: 7, type: "click", link: "dub.sh/github", location: "Paris, FR", device: "Firefox / Linux", time: "42 min ago" },
];

const typeColors: Record<string, string> = {
  click: "bg-blue-50 text-blue-600",
  lead: "bg-amber-50 text-amber-600",
  sale: "bg-green-50 text-green-600",
};

export default function EventsPage() {
  return (
    <PageShell title="Events" description="Real-time event stream for clicks, leads, and sales.">
      <div className="mt-4 rounded-lg border border-border">
        {/* Desktop table */}
        <div className="hidden divide-y divide-border sm:block">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-3 px-4 py-2 text-xs font-medium text-page-text-muted">
            <span>Type</span>
            <span>Link</span>
            <span>Location</span>
            <span>Device</span>
            <span className="text-right">Time</span>
          </div>
          {EVENTS.map((event) => (
            <div key={event.id} className="grid cursor-pointer grid-cols-[80px_1fr_1fr_1fr_100px] items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent">
              <span className={`inline-flex w-fit items-center rounded px-1.5 py-0.5 text-xs font-medium capitalize ${typeColors[event.type]}`}>
                {event.type}
              </span>
              <span className="font-medium text-page-text">{event.link}</span>
              <span className="text-page-text-muted">{event.location}</span>
              <span className="text-page-text-muted">{event.device}</span>
              <span className="text-right text-page-text-muted">{event.time}</span>
            </div>
          ))}
        </div>
        {/* Mobile list */}
        <div className="divide-y divide-border sm:hidden">
          {EVENTS.map((event) => (
            <div key={event.id} className="flex items-start gap-3 px-4 py-3">
              <span className={`mt-0.5 inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-xs font-medium capitalize ${typeColors[event.type]}`}>
                {event.type}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-page-text">{event.link}</span>
                  <span className="shrink-0 text-xs text-page-text-muted">{event.time}</span>
                </div>
                <span className="mt-0.5 block text-xs text-page-text-muted">{event.location} · {event.device}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
