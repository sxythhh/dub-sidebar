import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta = {
  component: Drawer,
  parameters: { layout: "centered" },
  title: "UI/Drawer",
} satisfies Meta;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <Drawer onOpenChange={setOpen} open={open}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Drawer content goes here.
            </p>
          </div>
          <DrawerFooter>
            <Button>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};
