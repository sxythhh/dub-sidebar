import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "./AnalyticsPocToggleGroup";

const meta = {
  component: AnalyticsPocToggleGroup,
  parameters: { layout: "centered" },
  title: "Analytics POC/ToggleGroup",
} satisfies Meta<typeof AnalyticsPocToggleGroup>;

export default meta;
type Story = StoryObj;

export const DailyPerformanceVsCumulative: Story = {
  render: function Render() {
    const [value, setValue] = useState("daily");

    return (
      <AnalyticsPocToggleGroup onValueChange={setValue} value={value}>
        <AnalyticsPocToggleGroupItem value="daily">
          Daily Performance
        </AnalyticsPocToggleGroupItem>
        <AnalyticsPocToggleGroupItem value="cumulative">
          Cumulative
        </AnalyticsPocToggleGroupItem>
      </AnalyticsPocToggleGroup>
    );
  },
};

export const TopVsBottom: Story = {
  render: function Render() {
    const [value, setValue] = useState("top");

    return (
      <AnalyticsPocToggleGroup onValueChange={setValue} value={value}>
        <AnalyticsPocToggleGroupItem value="top">
          Top
        </AnalyticsPocToggleGroupItem>
        <AnalyticsPocToggleGroupItem value="bottom">
          Bottom
        </AnalyticsPocToggleGroupItem>
      </AnalyticsPocToggleGroup>
    );
  },
};
