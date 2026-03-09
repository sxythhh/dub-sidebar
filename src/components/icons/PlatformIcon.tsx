import type { FC, SVGProps } from "react";

import YoutubeIcon from "@/assets/icons/platforms/youtube.svg";
import TiktokIcon from "@/assets/icons/platforms/tiktok.svg";
import InstagramIcon from "@/assets/icons/platforms/instagram.svg";
import XIcon from "@/assets/icons/platforms/x.svg";

export { YoutubeIcon, TiktokIcon, InstagramIcon, XIcon };

// Canonical platforms — single source for IDs, labels, and icons.
// "twitter" renders as the X icon (via ICON_MAP alias below) but is
// excluded here so it never appears as a separate filter pill or label.
const PLATFORMS = [
  { id: "youtube", label: "YouTube", icon: YoutubeIcon },
  { id: "tiktok", label: "TikTok", icon: TiktokIcon },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "x", label: "X", icon: XIcon },
] as const;

const ICON_MAP: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  ...Object.fromEntries(PLATFORMS.map((p) => [p.id, p.icon])),
  twitter: XIcon,
};

export const PLATFORM_IDS = PLATFORMS.map((p) => p.id);

export const PLATFORM_LABELS: Record<string, string> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p.label]),
);

export const hasPlatformIcon = (platform: string) =>
  platform.toLowerCase() in ICON_MAP;

interface PlatformIconProps extends SVGProps<SVGSVGElement> {
  platform: string;
  size?: number;
}

export function PlatformIcon({
  platform,
  size = 16,
  className,
  ...rest
}: PlatformIconProps) {
  const Icon = ICON_MAP[platform.toLowerCase()];
  if (!Icon) return null;
  return <Icon width={size} height={size} className={className} {...rest} />;
}
