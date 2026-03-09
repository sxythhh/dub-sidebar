import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocKpiCard } from "./AnalyticsPocKpiCard";
import { analyticsPocMockData } from "./mock-data";

const meta = {
  component: AnalyticsPocKpiCard,
  parameters: { layout: "centered" },
  title: "Analytics POC/Cards",
} satisfies Meta<typeof AnalyticsPocKpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: analyticsPocMockData.kpis[0],
};
