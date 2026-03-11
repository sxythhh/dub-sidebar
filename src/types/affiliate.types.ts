export interface AffiliatePartner {
  id: string;
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  status: string;
  commissionBps: number;
  commissionDurationMonths: number;
  joinedAt: string;
}

export interface AffiliateCode {
  clicks: number;
  code: string;
  createdAt?: string;
  destinationPath: string;
  id: string;
  isActive: boolean;
  referrals: number;
}

export interface AffiliateMetrics {
  totalClicks: number;
  totalReferrals: number;
  totalEarnings: number;
}

export interface AffiliateChartPoint {
  date: string;
  clicks: number;
  referrals: number;
}

export interface AffiliateReferredUser {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  joinedAt: string;
}

export interface AffiliateMeResponse {
  partner: AffiliatePartner;
  codes: AffiliateCode[];
  metrics: AffiliateMetrics;
  chart: AffiliateChartPoint[];
  referredUsers: AffiliateReferredUser[];
}

export type AffiliateTimeframe = "today" | "week" | "month" | "lifetime";

export const TIMEFRAME_LABELS: Record<AffiliateTimeframe, string> = {
  lifetime: "All time",
  month: "Last 30 days",
  today: "Today",
  week: "Last 7 days",
};

export type DashboardTab = "overview" | "leaderboard";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  count: number;
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  signups: LeaderboardEntry[];
  clicks: LeaderboardEntry[];
  weekStart: string;
  weekEnd: string;
}

export interface MonthlyLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  clicks: number;
  referrals: number;
  isCurrentUser: boolean;
}

export interface MonthlyLeaderboardData {
  entries: MonthlyLeaderboardEntry[];
}

export type Theme = "dark" | "light";
