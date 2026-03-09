import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocChartToggleCard } from "./AnalyticsPocChartToggleCard";
import { analyticsPocMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocChartToggleCard,
  parameters: { layout: "centered" },
  title: "Analytics POC/Performance",
} satisfies Meta<typeof AnalyticsPocChartToggleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...analyticsPocMockData.performance.metrics[0],
  },
};
