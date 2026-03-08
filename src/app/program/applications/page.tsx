"use client";
import { PageShell } from "@/components/page-shell";

const APPLICATIONS = [
  { id: 1, name: "Dan Wilson", email: "dan@example.com", applied: "2 days ago", status: "pending", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face" },
  { id: 2, name: "Eva Martinez", email: "eva@blog.com", applied: "3 days ago", status: "pending", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face" },
  { id: 3, name: "Frank Lee", email: "frank@media.io", applied: "5 days ago", status: "pending", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face" },
  { id: 4, name: "Grace Kim", email: "grace@tech.co", applied: "1 week ago", status: "pending", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face" },
  { id: 5, name: "Henry Park", email: "henry@review.com", applied: "1 week ago", status: "pending", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face" },
];

export default function ApplicationsPage() {
  return (
    <PageShell title="Applications" description="Review pending partner applications.">
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        {APPLICATIONS.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <img src={a.avatar} alt="" className="size-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-medium text-neutral-900">{a.name}</div>
                <div className="text-xs text-neutral-500">{a.email} &middot; Applied {a.applied}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
                Decline
              </button>
              <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
