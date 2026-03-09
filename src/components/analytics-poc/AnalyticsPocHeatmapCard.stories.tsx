import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocHeatmapCard } from "./AnalyticsPocHeatmapCard";
import { analyticsPocMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocHeatmapCard,
  parameters: {
    layout: "padded",
  },
  title: "Analytics POC/Heatmap",
} satisfies Meta<typeof AnalyticsPocHeatmapCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: analyticsPocMockData.heatmaps[0],
};
