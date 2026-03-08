"use client";
import { PageShell } from "@/components/page-shell";
import { IconWorld, IconCheck, IconPlus } from "@tabler/icons-react";

const DOMAINS = [
  { id: 1, domain: "dub.sh", status: "active", links: 47 },
  { id: 2, domain: "acme.link", status: "active", links: 12 },
  { id: 3, domain: "go.acme.com", status: "pending", links: 0 },
];

export default function DomainsPage() {
  return (
    <PageShell title="Domains" description="Manage your custom domains for short links.">
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
          <IconPlus size={16} />
          Add domain
        </button>
      </div>
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        {DOMAINS.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <IconWorld size={16} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-900">{d.domain}</span>
              {d.status === "active" ? (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                  <IconCheck size={12} /> Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                  Pending
                </span>
              )}
            </div>
            <span className="text-sm text-neutral-500">{d.links} links</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
