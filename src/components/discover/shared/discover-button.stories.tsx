import type { Meta, StoryObj } from "@storybook/react";
import { DiscoverButton } from "./DiscoverButton";

const meta = {
  args: { onClick: () => {} },
  component: DiscoverButton,
  parameters: { layout: "centered" },
  title: "Discover/DiscoverButton",
} satisfies Meta<typeof DiscoverButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Join: Story = {
  args: { variant: "join" },
};

export const JoinCustomLabel: Story = {
  args: { children: "Apply Now", variant: "join" },
};

export const JoinDisabled: Story = {
  args: { disabled: true, variant: "join" },
};

export const Info: Story = {
  args: { variant: "info" },
};

export const InfoDisabled: Story = {
  args: { disabled: true, variant: "info" },
};
