import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocCampaignHealthTab } from "./AnalyticsPocCampaignHealthTab";
import { analyticsPocCampaignHealthMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocCampaignHealthTab,
  parameters: { layout: "fullscreen" },
  title: "Analytics POC/Campaign Health",
} satisfies Meta<typeof AnalyticsPocCampaignHealthTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: analyticsPocCampaignHealthMockData,
};
