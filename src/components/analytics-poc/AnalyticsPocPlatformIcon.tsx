import type { FC, SVGProps } from "react";
import XIcon from "@/assets/icons/platforms/x.svg";
import YoutubeIcon from "@/assets/icons/platforms/youtube.svg";
import FacebookIcon from "./icons/facebook.svg";
import InstagramIcon from "./icons/instagram.svg";
import TiktokIcon from "./icons/tiktok.svg";

const ANALYTICS_POC_PLATFORM_ICON_MAP: Record<
  string,
  FC<SVGProps<SVGSVGElement>>
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  x: XIcon,
  youtube: YoutubeIcon,
};

export const ANALYTICS_POC_PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  youtube: "YouTube",
};

const ANALYTICS_POC_PLATFORM_BRAND_COLORS: Record<string, string> = {
  facebook: "#4E8EEE",
  instagram: "#AE4EEE",
  tiktok: "#13C368",
  youtube: "#EE4E51",
};

export function hasAnalyticsPocPlatformIcon(platform: string) {
  return platform.toLowerCase() in ANALYTICS_POC_PLATFORM_ICON_MAP;
}

export function getAnalyticsPocPlatformBrandColor(platform: string) {
  return ANALYTICS_POC_PLATFORM_BRAND_COLORS[platform.toLowerCase()];
}

interface AnalyticsPocPlatformIconProps extends SVGProps<SVGSVGElement> {
  platform: string;
  size?: number;
  tone?: "brand" | "inherit";
}

export function AnalyticsPocPlatformIcon({
  platform,
  size = 16,
  tone = "brand",
  className,
  style,
  ...rest
}: AnalyticsPocPlatformIconProps) {
  const normalizedPlatform = platform.toLowerCase();
  const Icon = ANALYTICS_POC_PLATFORM_ICON_MAP[normalizedPlatform];
  if (!Icon) return null;

  const resolvedColor =
    tone === "brand"
      ? ANALYTICS_POC_PLATFORM_BRAND_COLORS[normalizedPlatform]
      : undefined;

  return (
    <Icon
      className={className}
      height={size}
      style={{ color: resolvedColor, ...style }}
      width={size}
      {...rest}
    />
  );
}
