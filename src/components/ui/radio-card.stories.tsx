import type { Meta, StoryObj } from "@storybook/react";
import { Globe, Lock, Zap } from "lucide-react";
import { useState } from "react";

import { RadioCard, RadioCardGroup } from "./radio-card";

const meta = {
  component: RadioCardGroup,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/RadioCard",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("public");
    return (
      <RadioCardGroup onValueChange={setValue} value={value}>
        <RadioCard
          description="Anyone can apply to this campaign"
          icon={<Globe className="text-white" size={16} />}
          title="Public"
          value="public"
        />
        <RadioCard
          description="Only invited creators can participate"
          icon={<Lock className="text-white" size={16} />}
          title="Private"
          value="private"
        />
        <RadioCard
          description="Hand-picked creators only"
          icon={<Zap className="text-white" size={16} />}
          title="Exclusive"
          value="exclusive"
        />
      </RadioCardGroup>
    );
  },
};

export const NoSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <RadioCardGroup onValueChange={setValue} value={value}>
        <RadioCard description="First option" title="Option A" value="a" />
        <RadioCard description="Second option" title="Option B" value="b" />
      </RadioCardGroup>
    );
  },
};
