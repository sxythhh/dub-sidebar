import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  component: Popover,
  parameters: { layout: "centered" },
  title: "UI/Popover",
} satisfies Meta;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label htmlFor="width">Width</Label>
          <Input defaultValue="100%" id="width" />
        </div>
      </PopoverContent>
    </Popover>
  ),
};
