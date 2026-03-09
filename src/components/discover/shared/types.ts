export type {
  CampaignDetails,
  CampaignResource,
  DiscoverCampaign,
  DiscoverResult,
  Platform,
  SortOption,
  StaticCampaignDetails,
  TopEarner,
  ViewDataPoint,
} from "@/lib/repositories/discover/types";

export interface HeroBannerProps {
  campaigns: import("@/lib/repositories/discover").DiscoverCampaign[];
  onCampaignClick: (
    campaign: import("@/lib/repositories/discover").DiscoverCampaign,
    e?: React.MouseEvent,
  ) => void;
  isClickDisabled?: boolean;
}
