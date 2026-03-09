import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  component: Avatar,
  parameters: { layout: "centered" },
  title: "UI/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type RenderStory = StoryObj<Meta>;

export const WithImage: RenderStory = {
  render: () => (
    <Avatar>
      <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: RenderStory = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: RenderStory = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};
