import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsPocChartPlaceholder } from "./AnalyticsPocChartPlaceholder";
import { analyticsPocMockData } from "./mock-data";

const performanceChart = analyticsPocMockData.performance.chart;
const enabledPerformanceMetricKeys = analyticsPocMockData.performance.metrics
  .filter((metric) => metric.enabled ?? true)
  .map((metric) => metric.metricKey)
  .filter((metricKey): metricKey is string => Boolean(metricKey));

const meta = {
  component: AnalyticsPocChartPlaceholder,
  parameters: { layout: "padded" },
  title: "Analytics POC/Chart Placeholder",
} satisfies Meta<typeof AnalyticsPocChartPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveLineChart: Story = {
  args: {
    ...performanceChart,
    visibleMetricKeys: enabledPerformanceMetricKeys,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover the chart to verify: no dot markers, dimmed base lines, and a soft-edged focus segment centered on the hover line.",
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-[1240px] p-6">
      <AnalyticsPocChartPlaceholder {...args} />
    </div>
  ),
};

export const NoVisibleMetrics: Story = {
  args: {
    ...performanceChart,
    visibleMetricKeys: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "With no visible metrics enabled, hover state should remain disabled (no tooltip, no focus segment, no hover line).",
      },
    },
  },
  render: (args) => (
    <div className="mx-auto max-w-[1240px] p-6">
      <AnalyticsPocChartPlaceholder {...args} />
    </div>
  ),
};
