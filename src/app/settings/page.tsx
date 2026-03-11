"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";
import { RichButton } from "@/components/rich-button";
import { useRouter } from "next/navigation";
import { useSideNav } from "@/components/sidebar/sidebar-context";

export default function SettingsPage() {
  const router = useRouter();
  const { setEditMode } = useSideNav();

  return (
    <SettingsShell title="General" description="Manage your workspace settings.">
      <SettingsCard title="Workspace name" description="The name of your workspace.">
        <input
          type="text"
          defaultValue="Acme Inc"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </SettingsCard>
      <SettingsCard title="Workspace slug" description="Your workspace's URL slug.">
        <div className="flex items-center gap-0 rounded-lg border border-border text-sm">
          <span className="border-r border-border bg-accent px-3 py-2 text-muted-foreground">app.outpace.io/</span>
          <input
            type="text"
            defaultValue="acme"
            className="flex-1 px-3 py-2 outline-none"
          />
        </div>
      </SettingsCard>
      <SettingsCard title="Customize sidebar" description="Reorder, show, or hide items in your sidebar navigation.">
        <RichButton
          size="sm"
          onClick={() => {
            setEditMode(true);
            router.push("/");
          }}
        >
          Customize sidebar
        </RichButton>
      </SettingsCard>
      <SettingsCard title="Delete workspace" description="Permanently delete your workspace and all its data. This action cannot be undone.">
        <RichButton size="sm" variant="destructive">
          Delete workspace
        </RichButton>
      </SettingsCard>
    </SettingsShell>
  );
}
