import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocRankListCard } from "./AnalyticsPocRankListCard";
import { analyticsPocMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocRankListCard,
  parameters: { layout: "centered" },
  title: "Analytics POC/RankListCard",
} satisfies Meta<typeof AnalyticsPocRankListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: analyticsPocMockData.viewsCard,
};
