"use client";
import { SettingsShell, SettingsCard } from "@/components/settings-shell";

const MEMBERS = [
  { name: "Tom Anderson", email: "tom@acme.com", role: "Owner", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" },
  { name: "Alice Chen", email: "alice@acme.com", role: "Admin", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" },
  { name: "Bob Smith", email: "bob@acme.com", role: "Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
];

export default function MembersPage() {
  return (
    <SettingsShell title="Members" description="Manage workspace members and their permissions.">
      <SettingsCard title="Team members">
        <div className="divide-y divide-border">
          {MEMBERS.map((m) => (
            <div key={m.email} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <img src={m.avatar} alt="" className="size-8 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-medium text-foreground">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </div>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{m.role}</span>
            </div>
          ))}
        </div>
      </SettingsCard>
    </SettingsShell>
  );
}
