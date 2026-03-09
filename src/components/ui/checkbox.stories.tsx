import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  component: Checkbox,
  parameters: { layout: "centered" },
  title: "UI/Checkbox",
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithLabel: RenderStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <Checkbox
          checked={checked}
          id="terms"
          onCheckedChange={(val) => setChecked(val as boolean)}
        />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    );
  },
};
