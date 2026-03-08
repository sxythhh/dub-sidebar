"use client";
import { PageShell } from "@/components/page-shell";
import { IconFolder, IconPlus } from "@tabler/icons-react";

const FOLDERS = [
  { id: 1, name: "Marketing", links: 23, color: "bg-blue-500" },
  { id: 2, name: "Product", links: 15, color: "bg-purple-500" },
  { id: 3, name: "Sales", links: 8, color: "bg-green-500" },
  { id: 4, name: "Social", links: 31, color: "bg-pink-500" },
];

export default function FoldersPage() {
  return (
    <PageShell title="Folders" description="Organize your links into folders.">
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]">
          <IconPlus size={16} />
          New folder
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FOLDERS.map((f) => (
          <div key={f.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
            <div className={`flex size-9 items-center justify-center rounded-lg ${f.color} text-white`}>
              <IconFolder size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-900">{f.name}</div>
              <div className="text-xs text-neutral-500">{f.links} links</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
