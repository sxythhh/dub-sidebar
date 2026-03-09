import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  component: Card,
  parameters: { layout: "centered" },
  title: "UI/Card",
} satisfies Meta<typeof Card>;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: () => (
    <Card style={{ width: 380 }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: RenderStory = {
  render: () => (
    <Card style={{ width: 380 }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Message list here...</p>
      </CardContent>
    </Card>
  ),
};

export const Small: RenderStory = {
  render: () => (
    <Card size="sm" style={{ width: 300 }}>
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>Compact variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Less padding.</p>
      </CardContent>
    </Card>
  ),
};
