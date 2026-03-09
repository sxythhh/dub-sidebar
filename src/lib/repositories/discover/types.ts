export interface DiscoverCampaign {
  id: string;
  title: string;
  brand: string;
  avatar?: string;
  thumbnail?: string;
  totalBudget: string;
  budgetSpent: string;
  pricePerView: string;
  fundedAt: string;
  progressPercentage: number;
  creators: number;
  stats: {
    successRate: number;
    viewCount: string;
    engagement: string;
  };
  socialPlatforms: Platform[];
  campaignType: "clipping" | "ugc" | "both";
  category?: string;
  experienceId?: string;
  companyId?: string;
  whopProductRoute?: string;
  whopExperienceId?: string;
  isVerified?: boolean;
  description?: string;
  bannerPriority?: number | null;
  bannerImageUrl?: string | null;
}

export type Platform = "youtube" | "tiktok" | "instagram" | "x";

export type SortOption =
  | "featured"
  | "highest-budget"
  | "highest-cpm"
  | "newly-added"
  | "highest-available-budget"
  | "most-paid-out"
  | "most-creators";

export const ALL_PLATFORMS: Platform[] = [
  "youtube",
  "tiktok",
  "instagram",
  "x",
];

export interface CampaignRequirement {
  text: string;
  platform: string;
  isMandatory: boolean;
}

export interface CampaignPayout {
  platform: Platform;
  cpm: string;
  maxPayout: string | null;
  minViews: number;
}

export interface TopEarner {
  name: string;
  username: string;
  avatar?: string;
  viewCount: number;
}

export interface ViewDataPoint {
  date: string;
  views: number;
}

export interface CampaignResource {
  label: string;
  url: string;
  description?: string;
  platform: string;
}

export interface CampaignDetails {
  totalViews?: number;
  approvalRate?: number;
  totalSubmissions?: number;
  requirements: CampaignRequirement[];
  payouts: CampaignPayout[];
  topEarners?: TopEarner[];
  viewsByDate?: ViewDataPoint[];
  submissionsByDate?: ViewDataPoint[];
  resources: CampaignResource[];
}

export interface DiscoverResult {
  success: boolean;
  bannerCampaigns: DiscoverCampaign[];
  featuredMixCampaigns: DiscoverCampaign[];
  featuredCampaigns: DiscoverCampaign[];
}

export interface CampaignStats {
  approvalRate: number;
  creators: number;
}

export type DiscoverMvRow = {
  id: string;
  title: string;
  description: string | null;
  campaign_type: string | null;
  category: string | null;
  total_budget: unknown;
  budget_spent: unknown;
  funded_at: Date | null;
  created_at: Date | null;
  thumbnail_url: string | null;
  logo_url: string | null;
  experience_id: string | null;
  whop_product_route: string | null;
  company_name: string | null;
  experience_logo_url: string | null;
  company_id: string | null;
  is_verified: boolean | null;
  whop_experience_id: string | null;
  max_cpm: unknown;
  social_platforms: unknown;
  total_views: unknown;
  banner_priority: number | null;
  banner_image_url: string | null;
};

export interface StaticCampaignDetails {
  requirements: CampaignRequirement[];
  payouts: CampaignPayout[];
  resources: CampaignResource[];
}
