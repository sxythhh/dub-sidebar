"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function BillingPage() {
  return (
    <SettingsShell title="Billing" description="Manage your subscription and billing details.">
      <SettingsCard title="Current plan" description="You are currently on the Free plan.">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground">Free</span>
            <span className="ml-2 text-sm text-muted-foreground">1,240 / 5,000 events used</span>
          </div>
          <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-page-bg transition-colors hover:bg-foreground/90">
            Upgrade
          </button>
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}
