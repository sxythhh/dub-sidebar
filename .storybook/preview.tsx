import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview, ReactRenderer } from "@storybook/react";
import { type ReactNode, useEffect, useState } from "react";
import "../src/styles/clipper-theme.css";

/** Observe `html.dark` class and return whether dark mode is active. */
function useDarkClass() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

/**
 * Sync the Storybook iframe body background with the active theme
 * so dark mode content isn't invisible against a white canvas.
 */
function SyncBackground({ children }: { children: ReactNode }) {
  const isDark = useDarkClass();
  useEffect(() => {
    document.body.style.setProperty(
      "background-color",
      isDark ? "#151515" : "#ffffff",
      "important",
    );
  }, [isDark]);
  return <>{children}</>;
}

const withProviders = (Story: () => ReactNode) => (
  <SyncBackground>
    <Story />
  </SyncBackground>
);

const preview: Preview = {
  decorators: [
    withProviders,
    withThemeByClassName<ReactRenderer>({
      defaultTheme: "light",
      parentSelector: "html",
      themes: {
        dark: "dark",
        light: "light",
      },
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default preview;
