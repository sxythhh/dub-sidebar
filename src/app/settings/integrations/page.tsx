"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function IntegrationsPage() {
  return (
    <SettingsShell title="Integrations" description="Connect third-party services to your workspace.">
      <SettingsCard title="Connected integrations" description="No integrations connected yet.">
        <button className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
          Browse integrations
        </button>
      </SettingsCard>
    </SettingsShell>
  );
}
