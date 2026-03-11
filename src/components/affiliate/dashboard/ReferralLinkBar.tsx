"use client";

import { Check, Link2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { AffiliateCode } from "@/types/affiliate.types";
import { ClipboardIcon } from "./icons";
import { darkOrb, glassCard } from "./styles";

interface ReferralLinkBarProps {
  codes: AffiliateCode[];
}

export function ReferralLinkBar({ codes }: ReferralLinkBarProps) {
  const [copied, setCopied] = useState(false);

  const activeCode = codes.find((c) => c.isActive) ?? codes[0];
  const referralUrl = activeCode
    ? `https://contentrewards.cc/r/${activeCode.code}`
    : "";

  const handleCopy = useCallback(() => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralUrl]);

  if (!activeCode) return null;

  return (
    <div
      className="relative self-stretch"
      style={{
        background: [
          "linear-gradient(180deg, var(--af-border-subtle) 0%, transparent 100%)",
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.08) 100%)",
        ].join(", "),
        borderRadius: 17,
        padding: 1,
      }}
    >
      <div
        className="relative flex flex-col sm:flex-row items-start sm:items-center"
        style={{
          ...glassCard,
          gap: 12,
          minHeight: 70,
          padding: 16,
        }}
      >
        <div style={darkOrb(36)}>
          <Link2 color="#FFFFFF" size={20} />
        </div>

        <div className="flex flex-col flex-1 min-w-0" style={{ gap: 4 }}>
          <span
            className="text-sm font-medium"
            style={{
              color: "var(--af-text)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
            }}
          >
            Your referral link
          </span>
          <span
            className="text-xs truncate"
            style={{ color: "var(--af-text-secondary)", lineHeight: "145%" }}
          >
            {referralUrl}
          </span>
        </div>

        <button
          className="flex items-center justify-center shrink-0 transition-[transform,filter] duration-150 ease-out active:scale-[0.96] active:[filter:blur(0.5px)]"
          onClick={handleCopy}
          style={{
            backgroundColor: "var(--af-bg-dropdown)",
            border: "1px solid var(--af-border)",
            borderRadius: 32,
            gap: 6,
            height: 36,
            minWidth: 120,
            padding: "6px 12px",
          }}
          type="button"
        >
          {copied ? (
            <Check color="#15803D" size={16} />
          ) : (
            <ClipboardIcon color="var(--af-text)" size={16} />
          )}
          <span
            className="text-sm font-semibold"
            style={{
              color: "var(--af-text)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
            }}
          >
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </button>
      </div>
    </div>
  );
}
