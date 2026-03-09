/**
 * Support docs content — sourced from auth-standalone i18n.
 * Run `pnpm tsx scripts/sync-docs-to-vector.ts` to sync to Upstash Vector after changes.
 */

export interface DocSection {
  id: string;
  heading: string;
  content: string;
}

export interface DocPage {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: DocSection[];
}

export interface DocCategory {
  id: string;
  name: string;
  icon: string;
  pages: DocPage[];
}

export const generalDocs: DocPage[] = [
  {
    id: "what-is-content-rewards",
    title: "What is Content Rewards?",
    subtitle:
      "Learn how Content Rewards connects brands with creators for viral content distribution.",
    intro:
      "Content Rewards is a platform that connects brands with thousands of creators who distribute content across TikTok, Instagram Reels, YouTube Shorts, and X. Brands pay only for verified views, while creators earn money for the content they post.",
    sections: [
      {
        id: "how-it-works",
        heading: "How it works",
        content: `**For Brands:**
1. Create a campaign with your content and budget
2. Set your CPM rate (cost per 1,000 views)
3. Creators discover and join your campaign
4. Review and approve submitted content
5. Pay only for verified views

**For Creators:**
1. Browse available campaigns
2. Apply to campaigns that match your niche
3. Create and submit content
4. Earn money based on your video's views
5. Request payouts when you're ready`,
      },
      {
        id: "why-content-rewards",
        heading: "Why use Content Rewards?",
        content: `**Brands benefit from:**
- Organic-feeling content distribution
- Pay-per-view pricing (much lower than traditional ads)
- Access to thousands of creators
- Full control over campaign settings and approvals

**Creators benefit from:**
- Earn money for content you're already making
- Work with real brands on paid campaigns
- Transparent view tracking and payouts
- No minimum follower requirements`,
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    subtitle: "Quick start guide for brands and creators on Content Rewards.",
    intro:
      "Whether you're a brand looking to distribute content or a creator looking to earn money, getting started on Content Rewards takes just a few minutes.",
    sections: [
      {
        id: "for-brands",
        heading: "For Brands",
        content: `1. **Sign up** at [whop.com/content-rewards](https://whop.com/content-rewards)
2. **Create your first campaign** with your content, budget, and requirements
3. **Deposit funds** to make your campaign live
4. **Review submissions** as creators apply and submit content
5. **Track performance** and pay only for verified views`,
      },
      {
        id: "for-creators",
        heading: "For Creators",
        content: `1. **Sign up** and complete your profile
2. **Link your social accounts** (TikTok, Instagram, YouTube, X)
3. **Browse campaigns** on the Discover page
4. **Apply to campaigns** that match your content style
5. **Submit your videos** and start earning`,
      },
    ],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    subtitle: "Common questions about Content Rewards answered.",
    intro:
      "Find answers to the most common questions about using Content Rewards.",
    sections: [
      {
        id: "general-questions",
        heading: "General Questions",
        content: `**How do I sign up?**
Visit [whop.com/content-rewards](https://whop.com/content-rewards) and click "Get Started" to create your account.

**Is Content Rewards free to use?**
Creating an account is free. Brands pay for views on their campaigns, and creators earn money from those campaigns.

**What platforms are supported?**
TikTok, Instagram Reels, YouTube Shorts, and X (Twitter).`,
      },
      {
        id: "payment-questions",
        heading: "Payment Questions",
        content: `**How do creators get paid?**
Creators request payouts through their dashboard. Payments are processed through Whop and typically arrive within 3-5 business days.

**What is CPM?**
CPM stands for "cost per mille" (cost per 1,000 views). If a campaign pays $2 CPM, you earn $2 for every 1,000 verified views.

**How are views verified?**
We use platform APIs and third-party verification to ensure view counts are accurate and not artificially inflated.`,
      },
      {
        id: "troubleshooting",
        heading: "Troubleshooting",
        content: `**My video wasn't approved. What should I do?**
Check the campaign requirements and make sure your content follows the guidelines. You can resubmit with a different video.

**My views aren't updating. Is something wrong?**
Views update every 4 hours. If you don't see updates after 24 hours, contact support.

**I need more help. How do I contact support?**
Use the chat widget in the bottom-right corner, or email support@whop.com.`,
      },
    ],
  },
];

import docsContent from "./docs-content.json";

export const categories: DocCategory[] = [
  {
    id: "general",
    name: "General",
    icon: "book",
    pages: generalDocs,
  },
  {
    id: "brands",
    name: "For Brands",
    icon: "briefcase",
    pages: docsContent.brands as DocPage[],
  },
  {
    id: "creators",
    name: "For Creators",
    icon: "video",
    pages: docsContent.creators as DocPage[],
  },
];

// Flatten all pages for search/lookup
export function getAllPages(): DocPage[] {
  return categories.flatMap((c) => c.pages);
}

export function getPageById(id: string): DocPage | undefined {
  return getAllPages().find((p) => p.id === id);
}

export function getCategoryForPage(
  pageId: string
): DocCategory | undefined {
  return categories.find((c) => c.pages.some((p) => p.id === pageId));
}
