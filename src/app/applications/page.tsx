"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabItem } from "@/components/ui/tabs";

// ── Icons ───────────────────────────────────────────────────────────

function ModalCloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V15.5C3.5 16.0523 3.94772 16.5 4.5 16.5H14.5C15.0523 16.5 15.5 16.0523 15.5 15.5V12.5M11.5 3.5H16.5M16.5 3.5V8.5M16.5 3.5L8.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CheckCircleFilledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM10.78 6.53C10.85 6.46 10.9 6.38 10.94 6.29C10.97 6.2 10.99 6.1 10.99 6C10.99 5.9 10.97 5.8 10.94 5.71C10.9 5.62 10.85 5.54 10.78 5.47C10.71 5.4 10.63 5.35 10.54 5.31C10.45 5.28 10.35 5.26 10.25 5.26C10.15 5.26 10.05 5.28 9.96 5.31C9.87 5.35 9.79 5.4 9.72 5.47L7 8.19L6.28 7.47C6.14 7.33 5.95 7.26 5.75 7.26C5.55 7.26 5.36 7.33 5.22 7.47C5.08 7.61 5.01 7.8 5.01 8C5.01 8.1 5.03 8.2 5.06 8.29C5.1 8.38 5.15 8.46 5.22 8.53L6.47 9.78C6.54 9.85 6.62 9.9 6.71 9.94C6.8 9.97 6.9 9.99 7 9.99C7.1 9.99 7.2 9.97 7.29 9.94C7.38 9.9 7.46 9.85 7.53 9.78L10.78 6.53Z" fill="currentColor" />
    </svg>
  );
}

function XCircleFilledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM10.47 6.53C10.73 6.27 10.73 5.85 10.47 5.59C10.21 5.33 9.79 5.33 9.53 5.59L8 7.12L6.47 5.59C6.21 5.33 5.79 5.33 5.53 5.59C5.27 5.85 5.27 6.27 5.53 6.53L7.06 8.06L5.53 9.59C5.27 9.85 5.27 10.27 5.53 10.53C5.79 10.79 6.21 10.79 6.47 10.53L8 9L9.53 10.53C9.79 10.79 10.21 10.79 10.47 10.53C10.73 10.27 10.73 9.85 10.47 9.59L8.94 8.06L10.47 6.53Z" fill="currentColor" />
    </svg>
  );
}

// ── Mock Data ───────────────────────────────────────────────────────

interface SocialAccount {
  platform: "tiktok" | "instagram";
  username: string;
  views: string;
  engagement: string;
  likes: string;
  comments: string;
}

interface Application {
  id: number;
  name: string;
  handle: string;
  date: string;
  avatar: string;
  campaign: string;
  campaignAvatar: string;
  platforms: { type: "tiktok" | "instagram"; count?: number; handle?: string }[];
  earned: string;
  bio: string;
  actionPlatforms: ("tiktok" | "instagram")[];
  appliedDate: string;
  motivation: string;
  socialAccounts: SocialAccount[];
}

const APPLICATIONS: Application[] = [
  {
    id: 1,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok", count: 3 }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok"],
    appliedDate: "2 Mar, 2026",
    motivation: "I've been creating fashion content for 3 years and my audience loves discovering new brands. I specialize in minimalist style and sustainable fashion. My engagement rate consistently outperforms the niche average, which means the brands I promote actually get results.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
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
      { type: "tiktok", count: 3 },
      { type: "instagram", count: 3 },
    ],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok", "instagram"],
    appliedDate: "28 Feb, 2026",
    motivation: "I've built a premium beauty and skincare community with 4.7M views on my last campaign. My audience is primarily 25-34 women with high purchasing power.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "instagram", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "instagram", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
  },
  {
    id: 3,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok", handle: "@creative_marc" }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok"],
    appliedDate: "1 Mar, 2026",
    motivation: "Fitness content is my passion and I've built a loyal community of 500K+ followers who trust my product recommendations.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
  },
];

// ── Social Account Card ─────────────────────────────────────────────

function SocialAccountCard({ account }: { account: SocialAccount }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card-bg p-4 transition-colors hover:bg-foreground/[0.02]">
      {/* Top row: platform + username + link | stat pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <PlatformIcon platform={account.platform} size={16} />
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 tracking-[0.01em] text-page-text">
            {account.username}
          </span>
        </div>
        <button className="flex size-5 cursor-pointer items-center justify-center text-page-text-muted transition-opacity hover:opacity-70">
          <ExternalLinkIcon />
        </button>
      </div>

      {/* Stat pills row */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Views */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(77,129,238,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Views
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#4D81EE]">
            {account.views}
          </span>
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(157,90,239,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Engagement
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#9D5AEF]">
            {account.engagement}
          </span>
        </div>

        {/* Likes */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(218,85,151,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Likes
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DA5597]">
            {account.likes}
          </span>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(0,178,89,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Comments
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#00B259]">
            {account.comments}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Application Details Modal ────────────────────────────────────────

type ModalTab = "application" | "recent-content" | "social-accounts";

function ApplicationDetailsModal({
  app,
  onClose,
  onAction,
}: {
  app: Application;
  onClose: () => void;
  onAction?: (action: "approve" | "reject") => void;
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const MODAL_TABS: ModalTab[] = ["application", "recent-content", "social-accounts"];
  const activeTab = MODAL_TABS[activeTabIndex];

  const tiktokCount = app.socialAccounts.filter((a) => a.platform === "tiktok").length;
  const instagramCount = app.socialAccounts.filter((a) => a.platform === "instagram").length;

  return (
    <Modal open onClose={onClose} maxWidth="max-w-[800px]" showClose={false}>
      <div
        className="flex flex-col overflow-hidden"
        style={{ height: "min(560px, calc(100vh - 120px))" }}
      >
        {/* Header */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border px-5">
          <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
            Application details
          </span>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-page-text-muted transition-opacity hover:opacity-70"
          >
            <ModalCloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
          {/* Creator info row */}
          <div className="flex items-center gap-2">
            <img
              src={app.avatar}
              alt={app.name}
              className="size-6 rounded-full object-cover"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                {app.name}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">
                ·
              </span>
              <div className="flex items-center gap-1">
                {app.actionPlatforms.map((p) => (
                  <div
                    key={p}
                    className="flex size-6 items-center justify-center rounded-full bg-accent"
                  >
                    <PlatformIcon platform={p} size={12} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex} variant="underline">
              <TabItem label="Application" index={0} />
              <TabItem label="Recent content" index={1} />
              <TabItem label="Social accounts" index={2} />
            </Tabs>
          </div>

          {/* Tab content */}
          {activeTab === "application" && (
            <div className="mt-4 flex flex-col gap-2">
              {/* Stat cards row */}
              <div className="flex gap-2">
                {/* Applied on */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {app.appliedDate}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied on
                  </span>
                </div>

                {/* Applied to */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <span className="truncate font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {app.campaign}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied to
                  </span>
                </div>

                {/* Applied with */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <div className="flex items-center gap-1.5">
                    {tiktokCount > 0 && (
                      <div className="flex items-center gap-1">
                        <PlatformIcon platform="tiktok" size={16} className="text-page-text-muted" />
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                          {tiktokCount}
                        </span>
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">
                          Accounts
                        </span>
                      </div>
                    )}
                    {tiktokCount > 0 && instagramCount > 0 && (
                      <span className="font-inter text-sm leading-[1.2] tracking-[-0.09px] text-page-text-muted">
                        ·
                      </span>
                    )}
                    {instagramCount > 0 && (
                      <div className="flex items-center gap-1">
                        <PlatformIcon platform="instagram" size={16} className="text-page-text-muted" />
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                          {instagramCount}
                        </span>
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">
                          Accounts
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied with
                  </span>
                </div>
              </div>

              {/* Motivation card */}
              <div className="rounded-2xl border border-border bg-card-bg p-4">
                <div className="flex flex-col gap-3">
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Motivation
                  </span>
                  <p className="font-inter text-sm leading-none tracking-[-0.02em] text-page-text">
                    {app.motivation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recent-content" && (
            <div className="mt-4 flex flex-col items-center justify-center py-12 text-center">
              <span className="font-inter text-sm text-page-text-muted">
                Recent content will appear here
              </span>
            </div>
          )}

          {activeTab === "social-accounts" && (
            <div className="mt-4 flex flex-col gap-2">
              {app.socialAccounts.map((account, i) => (
                <SocialAccountCard key={i} account={account} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card-bg px-5 py-3">
          <button
            onClick={() => { onAction?.("approve"); onClose(); }}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-foreground/[0.06] py-1.5 pl-2.5 pr-3 text-page-text transition-colors hover:bg-foreground/[0.1]"
          >
            <CheckCircleFilledIcon />
            <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]">
              Accept
            </span>
          </button>
          <button
            onClick={() => { onAction?.("reject"); onClose(); }}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-[rgba(255,37,37,0.06)] py-1.5 pl-2.5 pr-3 text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.1)]"
          >
            <XCircleFilledIcon />
            <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]">
              Reject
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Application Card ────────────────────────────────────────────────

function ApplicationCard({ app, onClick }: { app: Application; onClick: () => void }) {
  return (
    <div
      className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow] duration-200 hover:border-foreground/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      onClick={onClick}
    >
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
          <button
            className="flex size-9 items-center justify-center rounded-[14px] bg-accent text-page-text transition-colors hover:bg-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <InfoCircleIcon />
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
                <PlatformIcon platform={p.type} className="opacity-50" />
                {p.count !== undefined ? (
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
                    {p.handle ?? ""}
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
      <div className="flex items-center justify-between px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-foreground/[0.06] py-1.5 pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            <CheckCircleFilledIcon />
            Accept
          </button>
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-[rgba(255,37,37,0.06)] py-1.5 pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.1)]">
            <XCircleFilledIcon />
            Reject
          </button>
        </div>
        <div className="flex items-center gap-2">
          {app.actionPlatforms.map((p) => (
            <PlatformIcon key={p} platform={p} className="opacity-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const selectedApp = selectedAppId !== null ? APPLICATIONS.find((a) => a.id === selectedAppId) ?? null : null;

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(gridContainerRef);
  useEffect(() => { measureItems(); }, [measureItems]);
  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div>
      {/* Top nav */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
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
        <div
          ref={gridContainerRef}
          onMouseMove={handlers.onMouseMove}
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
          className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                className="pointer-events-none absolute z-0 rounded-2xl bg-accent"
                initial={{ left: activeRect.left, width: activeRect.width, top: activeRect.top, height: activeRect.height, opacity: 0 }}
                animate={{ left: activeRect.left, width: activeRect.width, top: activeRect.top, height: activeRect.height, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.15 } }}
              />
            )}
          </AnimatePresence>
          {APPLICATIONS.map((app, i) => (
            <div key={app.id} ref={(el) => registerItem(i, el)} className="relative z-10">
              <ApplicationCard
                app={app}
                onClick={() => setSelectedAppId(app.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          key={selectedApp.id}
          app={selectedApp}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}
