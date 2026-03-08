"use client";
import { PageShell } from "@/components/page-shell";
import { IconLink, IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";

const MOCK_LINKS = [
  { id: 1, short: "dub.sh/launch", url: "https://example.com/product-launch-2026", clicks: 2847, createdAt: "2 days ago" },
  { id: 2, short: "dub.sh/docs", url: "https://docs.example.com/getting-started", clicks: 1523, createdAt: "5 days ago" },
  { id: 3, short: "dub.sh/blog", url: "https://blog.example.com/announcing-v2", clicks: 891, createdAt: "1 week ago" },
  { id: 4, short: "dub.sh/demo", url: "https://example.com/schedule-demo", clicks: 456, createdAt: "2 weeks ago" },
  { id: 5, short: "dub.sh/github", url: "https://github.com/acme/project", clicks: 234, createdAt: "3 weeks ago" },
];

export default function LinksPage() {
  return (
    <PageShell title="Links" description="Create, organize, and measure the performance of your short links.">
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search links..."
              className="flex-1 bg-transparent outline-none placeholder:text-neutral-400"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50">
            <IconFilter size={16} />
            Filter
          </button>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
          <IconPlus size={16} />
          Create link
        </button>
      </div>
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        {MOCK_LINKS.map((link) => (
          <div key={link.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <IconLink size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900">{link.short}</div>
                <div className="text-xs text-neutral-500 max-w-[300px] truncate">{link.url}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900">{link.clicks.toLocaleString()} clicks</div>
              <div className="text-xs text-neutral-500">{link.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
