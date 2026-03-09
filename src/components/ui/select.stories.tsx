import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  component: Select,
  parameters: { layout: "centered" },
  title: "UI/Select",
} satisfies Meta;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: function Render() {
    const [value, setValue] = useState<string>("");
    return (
      <div style={{ width: 200 }}>
        <Select onValueChange={setValue} value={value}>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};
