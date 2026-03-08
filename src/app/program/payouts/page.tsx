"use client";
import { PageShell } from "@/components/page-shell";

const PAYOUTS = [
  { id: 1, partner: "Alice Chen", amount: "$1,240", status: "pending", date: "Mar 1, 2026", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" },
  { id: 2, partner: "Bob Smith", amount: "$890", status: "pending", date: "Mar 1, 2026", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
  { id: 3, partner: "Clara Davis", amount: "$2,100", status: "paid", date: "Feb 1, 2026", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
];

export default function PayoutsPage() {
  return (
    <PageShell title="Payouts" description="Manage partner payouts and payment history.">
      <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        {PAYOUTS.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <img src={p.avatar} alt="" className="size-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-medium text-neutral-900">{p.partner}</div>
                <div className="text-xs text-neutral-500">{p.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-900">{p.amount}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
