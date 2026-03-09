export interface CampaignStats {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sub: string;
}

export interface AgencyCampaign {
  id: string;
  title: string;
  thumbnail: string;
  stats: [CampaignStats, CampaignStats, CampaignStats];
}

export interface AgencyData {
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  website: string;
  services: string[];
  priceFrom: string;
  minBudget: string;
  campaigns: AgencyCampaign[];
}
