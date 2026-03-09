import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocTopPostsTable } from "./AnalyticsPocTopPostsTable";
import { analyticsPocMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocTopPostsTable,
  parameters: { layout: "fullscreen" },
  title: "Analytics POC/TopPostsTable",
} satisfies Meta<typeof AnalyticsPocTopPostsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...analyticsPocMockData.topPosts,
    className: "mx-auto max-w-[1224px]",
    headerTooltipText:
      "Top and bottom posts ranked by selected performance metrics.",
    pageSize: 10,
  },
};
