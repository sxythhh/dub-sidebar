"use client";

import { useRouter } from "next/navigation";
import { IconReplaceFilled } from "@tabler/icons-react";

export default function CreatorHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-page-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Creator Dashboard
        </span>
        <button
          onClick={() => router.push("/")}
          className="flex h-8 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] px-3 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]"
        >
          <IconReplaceFilled size={12} />
          Switch to Brand
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Welcome back, Tom
          </h1>
          <p className="mt-1 font-inter text-sm tracking-[-0.02em] text-page-text-muted">
            Here&apos;s an overview of your creator activity.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Earned" value="$12,480" />
          <StatCard label="Active Campaigns" value="3" />
          <StatCard label="Total Views" value="2.4M" />
          <StatCard label="Pending Payouts" value="$580" highlight />
        </div>

        {/* Active campaigns */}
        <div className="mt-8">
          <h2 className="mb-4 font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">
            Your Active Campaigns
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { name: "Harry Styles Podcast Clipping", earned: "$4,200", submissions: 12, views: "680K" },
              { name: "Call of Duty BO7 Campaign", earned: "$2,850", submissions: 8, views: "520K" },
              { name: "Mumford & Sons Clipping", earned: "$1,240", submissions: 5, views: "340K" },
            ].map((campaign) => (
              <div
                key={campaign.name}
                className="flex items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06]"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                    {campaign.name}
                  </span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                    {campaign.submissions} submissions · {campaign.views} views
                  </span>
                </div>
                <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">
                  {campaign.earned}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-center gap-2 rounded-2xl border border-[rgba(37,37,37,0.06)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.06] ${
        highlight
          ? "bg-[rgba(255,144,37,0.1)]"
          : "bg-card-bg"
      }`}
    >
      <span
        className={`font-inter text-xl font-semibold tracking-[-0.02em] ${
          highlight ? "text-[#FF9025]" : "text-page-text"
        }`}
      >
        {value}
      </span>
      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
        {label}
      </span>
    </div>
  );
}
