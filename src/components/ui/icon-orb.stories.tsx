import type { Meta, StoryObj } from "@storybook/react";
import { Sparkles, Star, Zap } from "lucide-react";

import { IconOrb } from "./icon-orb";

const meta = {
  component: IconOrb,
  parameters: { layout: "centered" },
  title: "Glass/IconOrb",
} satisfies Meta<typeof IconOrb>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Small: Story = {
  args: {
    children: <Zap className="text-white" size={16} />,
    size: 36,
  },
};

export const Large: Story = {
  args: {
    children: <Star className="text-white" size={20} />,
    size: 44,
  },
};

export const AllIcons: RenderStory = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <IconOrb size={36}>
        <Zap className="text-white" size={16} />
      </IconOrb>
      <IconOrb size={44}>
        <Star className="text-white" size={20} />
      </IconOrb>
      <IconOrb size={36}>
        <Sparkles className="text-white" size={16} />
      </IconOrb>
    </div>
  ),
};
