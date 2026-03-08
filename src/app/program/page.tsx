"use client";
import { PageShell } from "@/components/page-shell";

export default function ProgramPage() {
  return (
    <PageShell title="Partner Program" description="Overview of your referral and affiliate program.">
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Active partners", value: "127" },
          { label: "Pending payouts", value: "$4,230" },
          { label: "Revenue generated", value: "$28,450" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 p-4">
            <div className="text-sm text-neutral-500">{stat.label}</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
