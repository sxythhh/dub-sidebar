"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { LinkBuilderModal } from "@/components/link-builder/link-builder-modal";
import { NewCampaignButton } from "@/components/sidebar/new-campaign-dropdown";
import { RichButton } from "@/components/rich-button";

export default function Page() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-14 items-center justify-between border-b border-page-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Links
          </span>
        </div>

        <NewCampaignButton />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-4 py-16 sm:px-5 sm:py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-page-border">
            <IconPlus size={20} className="text-page-text-muted" />
          </div>
          <div className="text-center">
            <p className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
              No links yet
            </p>
            <p className="mt-1 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text-muted">
              Create your first short link to get started.
            </p>
          </div>
          <RichButton
            size="sm"
            onClick={() => setShowBuilder(true)}
            className="mt-2 rounded-2xl"
          >
            New campaign
          </RichButton>
        </div>
      </div>

      <LinkBuilderModal open={showBuilder} onClose={() => setShowBuilder(false)} />
    </div>
  );
}
