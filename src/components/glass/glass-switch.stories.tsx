import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { GlassSwitch } from "./glass-switch";

const meta = {
  component: GlassSwitch,
  parameters: { layout: "centered" },
  title: "Glass/Switch",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return <GlassSwitch checked={checked} onCheckedChange={setChecked} />;
  },
};

export const On: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <GlassSwitch checked={checked} onCheckedChange={setChecked} />;
  },
};
