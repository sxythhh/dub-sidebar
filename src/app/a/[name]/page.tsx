import type { Metadata } from "next";
import { AgencyLanding } from "@/components/agency/AgencyLanding";

import type { AgencyData } from "@/components/agency/types";

const MOCK_AGENCY: AgencyData = {
  name: "billbord",
  logo: "https://assets-2-prod.whop.com/uploads/user_868511/image/bots/2025-08-02/b43e7f45-d7ad-4172-9362-e047b9d7e5eb",
  verified: true,
  rating: 5,
  reviewCount: 356,
  description:
    "billbord connects brands with creators who actually move the needle. We run performance-driven UGC campaigns across TikTok, Instagram, and YouTube — handling everything from creator sourcing to content approvals so you can focus on scaling.",
  website: "https://billbord.com",
  services: [
    "UGC campaigns",
    "Creator sourcing",
    "TikTok",
    "Instagram",
    "YouTube",
    "Performance marketing",
  ],
  priceFrom: "$1,500/mo",
  minBudget: "$5,000",
  campaigns: [
    {
      id: "f16e1209-88e2-4f9a-9973-b46f94470eec",
      title: "Cloudbet Soccer",
      thumbnail:
        "https://saqnibxhsephhucwjbdw.supabase.co/storage/v1/object/public/campaign-thumbnails/temp_1770667130026/1770667132520.png",
      stats: [
        { label: "Budget", value: 16875, prefix: "$", sub: "$4,640 used" },
        { label: "Creators", value: 435, sub: "Approved" },
        { label: "Submissions", value: 1229, sub: "Total" },
      ],
    },
    {
      id: "4592f127-a1ac-443d-b7f6-f5d88b0e4740",
      title: "Cloudbet Casino",
      thumbnail:
        "https://saqnibxhsephhucwjbdw.supabase.co/storage/v1/object/public/campaign-thumbnails/temp_1770688016555/1770688017765.png",
      stats: [
        { label: "Budget", value: 10075, prefix: "$", sub: "$2,982 used" },
        { label: "Creators", value: 487, sub: "Approved" },
        { label: "Submissions", value: 1021, sub: "Total" },
      ],
    },
    {
      id: "b2ae3a8f-d029-4c22-bd0e-ae2d1537ace4",
      title: "Duel Open",
      thumbnail:
        "https://saqnibxhsephhucwjbdw.supabase.co/storage/v1/object/public/campaign-thumbnails/temp_1770319939461/1770319940617.png",
      stats: [
        { label: "Budget", value: 4000, prefix: "$", sub: "$1,958 used" },
        { label: "Creators", value: 236, sub: "Approved" },
        { label: "Submissions", value: 702, sub: "Total" },
      ],
    },
    {
      id: "7602a30c-902d-4af6-9cac-146743a56c1b",
      title: "Bet 25 Logo",
      thumbnail:
        "https://saqnibxhsephhucwjbdw.supabase.co/storage/v1/object/public/campaign-thumbnails/temp_1770231205089/1770231205343.jpg",
      stats: [
        { label: "Budget", value: 4000, prefix: "$", sub: "$2,972 used" },
        { label: "Creators", value: 529, sub: "Approved" },
        { label: "Submissions", value: 750, sub: "Total" },
      ],
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const displayName = decodeURIComponent(name).replace(/-/g, " ");
  return {
    title: `${displayName} | Content Rewards`,
    description: `Partner with ${displayName} on Content Rewards. View active campaigns and start earning.`,
  };
}

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  void name;

  return <AgencyLanding agency={MOCK_AGENCY} />;
}
