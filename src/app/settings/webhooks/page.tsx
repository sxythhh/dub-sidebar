"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";
import { IconPlus } from "@tabler/icons-react";

export default function WebhooksPage() {
  return (
    <SettingsShell title="Webhooks" description="Configure webhook endpoints for real-time event notifications.">
      <SettingsCard title="Webhook endpoints" description="No webhook endpoints configured.">
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
          <IconPlus size={16} />
          Add endpoint
        </button>
      </SettingsCard>
    </SettingsShell>
  );
}
