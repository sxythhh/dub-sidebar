"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function NotificationsPage() {
  return (
    <SettingsShell title="Notifications" description="Configure your notification preferences.">
      <SettingsCard title="Email notifications" description="Choose which emails you want to receive.">
        <div className="space-y-3">
          {["Weekly report", "New partner signup", "Payout processed", "Domain verification"].map((item) => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{item}</span>
              <input type="checkbox" defaultChecked className="size-4 rounded border-border accent-foreground" />
            </label>
          ))}
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}
