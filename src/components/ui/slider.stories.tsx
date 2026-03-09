import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Slider } from "./slider";

const meta = {
  component: Slider,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/Slider",
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: function Render() {
    const [value, setValue] = useState([50]);
    return <Slider onValueChange={setValue} value={value} />;
  },
};

export const WithDots: RenderStory = {
  render: function Render() {
    const [value, setValue] = useState([12]);
    return (
      <Slider
        dots={7}
        max={35}
        min={1}
        onValueChange={setValue}
        value={value}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: [30] },
};
