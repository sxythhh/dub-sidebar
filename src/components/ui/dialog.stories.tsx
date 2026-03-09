import type { Meta, StoryObj } from "@storybook/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { GlassPrimaryButton, GlassSecondaryButton } from "./glass-button";

const meta = {
  component: Dialog,
  parameters: { layout: "centered" },
  title: "Glass/Dialog",
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <GlassSecondaryButton>Open Dialog</GlassSecondaryButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Campaign</DialogTitle>
        </DialogHeader>
        <div className="px-8 py-6">
          <p className="text-sm text-glass-text-secondary">
            This is a dialog with header, body, and footer sections.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <GlassSecondaryButton>Cancel</GlassSecondaryButton>
          </DialogClose>
          <DialogClose asChild>
            <GlassPrimaryButton>Submit</GlassPrimaryButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
