"use client";

import { Info } from "lucide-react";
import type { MonthlyLeaderboardEntry } from "@/types/affiliate.types";
import { TrophyIcon } from "./icons";
import { LeaderboardTable } from "./LeaderboardTable";
import { PODIUM_STYLES, PodiumCard } from "./PodiumCard";
import { glassCard } from "./styles";

// Demo leaderboard data
const DEMO_LEADERBOARD: MonthlyLeaderboardEntry[] = [
  { rank: 1, userId: "u1", name: "CryptoNinja", username: "cryptoninja", avatarUrl: null, clicks: 1284, referrals: 342, isCurrentUser: false },
  { rank: 2, userId: "u2", name: "StreamQueen", username: "streamqueen", avatarUrl: null, clicks: 1056, referrals: 289, isCurrentUser: false },
  { rank: 3, userId: "u3", name: "DevMaster", username: "devmaster", avatarUrl: null, clicks: 945, referrals: 256, isCurrentUser: false },
  { rank: 4, userId: "u4", name: "PixelHunter", username: "pixelhunter", avatarUrl: null, clicks: 723, referrals: 198, isCurrentUser: false },
  { rank: 5, userId: "u5", name: "CodeWizard", username: "codewizard", avatarUrl: null, clicks: 612, referrals: 167, isCurrentUser: false },
  { rank: 6, userId: "u6", name: "Tom Anderson", username: "tom", avatarUrl: null, clicks: 445, referrals: 127, isCurrentUser: true },
  { rank: 7, userId: "u7", name: "NovaCraft", username: "novacraft", avatarUrl: null, clicks: 389, referrals: 98, isCurrentUser: false },
  { rank: 8, userId: "u8", name: "CosmicLuna", username: "cosmicluna", avatarUrl: null, clicks: 312, referrals: 85, isCurrentUser: false },
];

export function MonthlyLeaderboard() {
  const entries = DEMO_LEADERBOARD;
  const entryByRank = new Map(entries.map((e) => [e.rank, e]));

  return (
    <div
      className="flex flex-col self-stretch"
      style={{ ...glassCard, gap: 16, padding: 16 }}
    >
      <div className="flex items-center justify-between" style={{ gap: 12 }}>
        <div className="flex items-center flex-1" style={{ gap: 6 }}>
          <TrophyIcon color="var(--af-text-muted)" size={16} />
          <span
            className="text-sm"
            style={{
              color: "var(--af-text-secondary)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
            }}
          >
            Leaderboard
          </span>
          <span title="Top affiliates ranked by all-time signups">
            <Info size={16} style={{ color: "var(--af-text-faint)" }} />
          </span>
        </div>
      </div>

      <>
        <div className="relative overflow-visible">
          <div
            className="flex items-end justify-center relative z-[1]"
            style={{ gap: 8 }}
          >
            {PODIUM_STYLES.map((style) => {
              const entry = entryByRank.get(style.rank);
              return (
                <PodiumCard
                  avatarUrl={entry?.avatarUrl ?? null}
                  key={style.rank}
                  name={entry?.name ?? "\u2014"}
                  stat={entry ? `${entry.referrals} referred` : "\u2014"}
                  style={style}
                />
              );
            })}
          </div>
        </div>

        <LeaderboardTable entries={entries} />
      </>
    </div>
  );
}
