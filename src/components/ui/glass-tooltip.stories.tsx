import type { Meta, StoryObj } from "@storybook/react";

import { GlassTooltip } from "./glass-tooltip";

const meta = {
  component: GlassTooltip,
  parameters: { layout: "centered" },
  title: "Glass/Tooltip",
} satisfies Meta<typeof GlassTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: Story = {
  args: {
    text: "If you have a specific style in mind, add a few example video links so the creator can align with your vision.",
  },
};

export const CustomTrigger: RenderStory = {
  render: () => (
    <GlassTooltip text="This is a tooltip with a custom trigger element.">
      <span className="cursor-help rounded-full border border-white/10 px-3 py-1 text-sm text-white/72">
        Hover me
      </span>
    </GlassTooltip>
  ),
};
