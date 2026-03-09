import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3 } from "lucide-react";
import { AnalyticsPocCardHeader, AnalyticsPocPanel } from "./index";

const meta = {
  component: AnalyticsPocPanel,
  parameters: { layout: "centered" },
  title: "Analytics POC/Panel",
} satisfies Meta<typeof AnalyticsPocPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="w-[360px]">
        <AnalyticsPocCardHeader
          helperText="Reusable analytics section heading."
          icon={<BarChart3 className="size-4" />}
          title="Section"
          tooltipText="Shared analytics heading styles."
        />
        <p className="font-inter text-xs text-[var(--ap-text-secondary)]">
          Reusable analytics panel surface.
        </p>
      </div>
    ),
    padding: "md",
  },
};
