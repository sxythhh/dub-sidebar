"use client";
import { PageShell } from "@/components/page-shell";
import { IconPlus } from "@tabler/icons-react";

const TAGS = [
  { id: 1, name: "campaign", color: "bg-blue-500", links: 12 },
  { id: 2, name: "blog", color: "bg-green-500", links: 8 },
  { id: 3, name: "social", color: "bg-pink-500", links: 15 },
  { id: 4, name: "product", color: "bg-purple-500", links: 6 },
  { id: 5, name: "email", color: "bg-amber-500", links: 4 },
];

export default function TagsPage() {
  return (
    <PageShell title="Tags" description="Label and categorize your links with tags.">
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
          <IconPlus size={16} />
          New tag
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 transition-colors hover:bg-neutral-50">
            <div className={`size-2.5 rounded-full ${t.color}`} />
            <span className="text-sm font-medium text-neutral-900">{t.name}</span>
            <span className="text-xs text-neutral-400">{t.links}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
