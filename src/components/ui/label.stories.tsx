import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";

const meta = {
  component: Label,
  parameters: { layout: "centered" },
  title: "UI/Label",
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email address" },
};
