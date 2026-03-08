"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

export default function SettingsPage() {
  return (
    <SettingsShell title="General" description="Manage your workspace settings.">
      <SettingsCard title="Workspace name" description="The name of your workspace on Dub.">
        <input
          type="text"
          defaultValue="Acme Inc"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
        />
      </SettingsCard>
      <SettingsCard title="Workspace slug" description="Your workspace's URL slug on Dub.">
        <div className="flex items-center gap-0 rounded-lg border border-neutral-200 text-sm">
          <span className="border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-500">app.dub.co/</span>
          <input
            type="text"
            defaultValue="acme"
            className="flex-1 px-3 py-2 outline-none"
          />
        </div>
      </SettingsCard>
      <SettingsCard title="Delete workspace" description="Permanently delete your workspace and all its data. This action cannot be undone.">
        <button className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
          Delete workspace
        </button>
      </SettingsCard>
    </SettingsShell>
  );
}
