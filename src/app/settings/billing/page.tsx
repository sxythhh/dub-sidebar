"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function BillingPage() {
  return (
    <SettingsShell title="Billing" description="Manage your subscription and billing details.">
      <SettingsCard title="Current plan" description="You are currently on the Free plan.">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">Free</span>
            <span className="ml-2 text-sm text-neutral-500">1,240 / 5,000 events used</span>
          </div>
          <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
            Upgrade
          </button>
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}
