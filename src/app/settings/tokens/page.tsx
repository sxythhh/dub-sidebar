"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";
import { IconPlus } from "@tabler/icons-react";

export default function TokensPage() {
  return (
    <SettingsShell title="API Keys" description="Manage API keys for programmatic access.">
      <SettingsCard title="API keys" description="Create and manage API keys for the Dub API.">
        <button className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
          <IconPlus size={16} />
          Create API key
        </button>
      </SettingsCard>
    </SettingsShell>
  );
}
