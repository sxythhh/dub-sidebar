"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function SettingsDomainsPage() {
  return (
    <SettingsShell title="Domains" description="Configure custom domains for your workspace.">
      <SettingsCard title="Custom domains" description="Add your own domain for branded short links.">
        <p className="text-sm text-muted-foreground">You have 2 custom domains configured.</p>
      </SettingsCard>
    </SettingsShell>
  );
}
