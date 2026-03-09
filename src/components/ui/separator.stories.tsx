import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from "./separator";

const meta = {
  component: Separator,
  parameters: { layout: "centered" },
  title: "UI/Separator",
} satisfies Meta<typeof Separator>;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Horizontal: RenderStory = {
  render: () => (
    <div style={{ width: 300 }}>
      <p className="text-sm">Above</p>
      <Separator className="my-4" />
      <p className="text-sm">Below</p>
    </div>
  ),
};

export const Vertical: RenderStory = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 12, height: 24 }}>
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
