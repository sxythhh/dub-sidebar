"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function IntegrationsPage() {
  return (
    <SettingsShell title="Integrations" description="Connect third-party services to your workspace.">
      <SettingsCard title="Connected integrations" description="No integrations connected yet.">
        <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Browse integrations
        </button>
      </SettingsCard>
    </SettingsShell>
  );
}
