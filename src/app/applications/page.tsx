"use client";

import { IconCircleCheck, IconCircleX, IconInfoCircle } from "@tabler/icons-react";

// ── Platform Icons ──────────────────────────────────────────────────

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="text-foreground/56">
      <path
        d="M11.52 2.72A3.36 3.36 0 0110.08.67H7.68v10.08a2 2 0 11-1.36-1.9V6.37a4.48 4.48 0 103.84 4.43V6.59A5.76 5.76 0 0013.6 7.87V5.44a3.36 3.36 0 01-2.08-2.72z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="text-foreground/56">
      <rect x="1.67" y="1.67" width="12.67" height="12.67" rx="3.67" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.67" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

// ── Mock Data ───────────────────────────────────────────────────────

const APPLICATIONS = [
  {
    id: 1,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok" as const, count: 3 }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok" as const],
  },
  {
    id: 2,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [
      { type: "tiktok" as const, count: 3 },
      { type: "instagram" as const, count: 3 },
    ],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok" as const, "instagram" as const],
  },
  {
    id: 3,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok" as const, handle: "@creative_marc" }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok" as const],
  },
];

// ── Platform Icon Renderer ──────────────────────────────────────────

function PlatformIcon({ type, size = 16 }: { type: "tiktok" | "instagram"; size?: number }) {
  if (type === "tiktok") return <TikTokIcon size={size} />;
  return <InstagramIcon size={size} />;
}

// ── Application Card ────────────────────────────────────────────────

function ApplicationCard({ app }: { app: (typeof APPLICATIONS)[number] }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        {/* Creator info + info button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={app.avatar}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                {app.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  {app.handle}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-muted-foreground">
                  ·
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  {app.date}
                </span>
              </div>
            </div>
          </div>
          <button className="flex size-9 items-center justify-center rounded-[14px] bg-accent text-page-text transition-colors hover:bg-accent">
            <IconInfoCircle size={16} stroke={1.5} />
          </button>
        </div>

        {/* Campaign pill with connector */}
        <div className="flex items-center gap-1 pb-2 pl-[25px]">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-border">
            <path d="M0.75 0.75V8.75C0.75 10.9591 2.54086 12.75 4.75 12.75H16.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="inline-flex items-center gap-1 rounded-full bg-accent py-px pl-0.5 pr-1.5">
            <img
              src={app.campaignAvatar}
              alt=""
              className="size-3 rounded-full object-cover"
            />
            <span className="font-[family-name:var(--font-inter)] text-xs leading-[120%] text-page-text-subtle">
              {app.campaign}
            </span>
          </div>
        </div>
      </div>

      {/* Platform stats bar */}
      <div className="border-y border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {app.platforms.map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-page-text-subtle">
                    ·
                  </span>
                )}
                <PlatformIcon type={p.type} />
                {"count" in p ? (
                  <div className="flex items-center gap-1">
                    <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-text">
                      {p.count}
                    </span>
                    <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-page-text-subtle">
                      Accounts
                    </span>
                  </div>
                ) : (
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-muted-foreground">
                    {"handle" in p ? p.handle : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-text">
            {app.earned}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 pt-3">
        <p className="font-[family-name:var(--font-inter)] text-sm leading-[145%] tracking-[-0.09px] text-page-text-subtle">
          {app.bio}
        </p>
      </div>

      {/* Footer: Accept/Reject + platform icons */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-foreground pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-bg transition-colors hover:bg-foreground/90">
            <IconCircleCheck size={16} stroke={1.5} />
            Accept
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-accent pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-text transition-colors hover:bg-accent">
            <IconCircleX size={16} stroke={1.5} />
            Reject
          </button>
        </div>
        <div className="flex items-center gap-2">
          {app.actionPlatforms.map((p) => (
            <PlatformIcon key={p} type={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  return (
    <div>
      {/* Top nav */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Applications
          </span>
        </div>

        <button className="hidden h-9 items-center gap-1.5 rounded-full px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-accent sm:flex">
          Manage all the incoming applications to your campaigns
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-5 sm:px-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATIONS.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
