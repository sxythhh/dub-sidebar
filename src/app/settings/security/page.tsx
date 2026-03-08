"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function SecurityPage() {
  return (
    <SettingsShell title="Security" description="Manage workspace security settings.">
      <SettingsCard title="SAML SSO" description="Configure SAML single sign-on for your workspace.">
        <p className="text-sm text-neutral-500">Available on Enterprise plan.</p>
      </SettingsCard>
    </SettingsShell>
  );
}
