import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Stepper } from "./stepper";

const STEPS = [
  { key: "details", label: "Campaign Details" },
  { key: "platforms", label: "Platforms & Rewards" },
  { key: "content", label: "Content Requirements" },
  { key: "questions", label: "Application Questions" },
  { key: "review", label: "Review & Launch" },
];

const meta = {
  component: Stepper,
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/Stepper",
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: function Render() {
    const [index, setIndex] = useState(2);
    return (
      <Stepper currentIndex={index} onStepClick={setIndex} steps={STEPS} />
    );
  },
};

export const FirstStep: Story = {
  args: { currentIndex: 0, steps: STEPS },
};

export const LastStep: Story = {
  args: { currentIndex: 4, steps: STEPS },
};
