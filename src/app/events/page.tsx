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
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-3 px-4 py-2 text-xs font-medium text-neutral-500">
          <span>Type</span>
          <span>Link</span>
          <span>Location</span>
          <span>Device</span>
          <span className="text-right">Time</span>
        </div>
        {EVENTS.map((event) => (
          <div key={event.id} className="grid cursor-pointer grid-cols-[80px_1fr_1fr_1fr_100px] items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50">
            <span className={`inline-flex w-fit items-center rounded px-1.5 py-0.5 text-xs font-medium capitalize ${typeColors[event.type]}`}>
              {event.type}
            </span>
            <span className="font-medium text-neutral-900">{event.link}</span>
            <span className="text-neutral-600">{event.location}</span>
            <span className="text-neutral-500">{event.device}</span>
            <span className="text-right text-neutral-500">{event.time}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
