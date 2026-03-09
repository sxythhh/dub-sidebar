"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";
const TRANSITION_CLASS = "theme-transition";
const LOADED_CLASS = "theme-loaded";

function getWhopTheme(): ResolvedTheme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /whop-frosted-theme=appearance:(light|dark)/,
  );
  return match ? (match[1] as ResolvedTheme) : null;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  const whopTheme = getWhopTheme();
  if (whopTheme) return whopTheme;
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme with smooth transitions using View Transitions API.
 * Falls back to CSS transitions if View Transitions API is not supported.
 */
function applyTheme(resolvedTheme: ResolvedTheme, enableTransition = false) {
  const root = document.documentElement;

  const updateTheme = () => {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  };

  if (!enableTransition) {
    updateTheme();
    return;
  }

  // Use View Transitions API for smooth cross-fade if available
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    (
      document as Document & {
        startViewTransition: (callback: () => void) => void;
      }
    ).startViewTransition(updateTheme);
  } else {
    // Fallback to CSS transitions
    root.classList.add(TRANSITION_CLASS);
    updateTheme();
    setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS);
    }, 300);
  }
}

/**
 * Save theme to localStorage without blocking UI.
 * Uses queueMicrotask to defer storage write after current task.
 */
function saveThemeToStorage(theme: Theme) {
  queueMicrotask(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage not available
    }
  });
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * Read the initial theme from the DOM class (set by WhopThemeScript)
 * or fall back to cookie/system preference.
 */
function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  const whopTheme = getWhopTheme();
  if (whopTheme) return whopTheme;
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const isDev = process.env.NODE_ENV === "development";
  const [theme, setThemeState] = useState<Theme>(() =>
    getInitialTheme(defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getInitialTheme(defaultTheme)),
  );

  // Apply theme to DOM on mount and mark as loaded
  useEffect(() => {
    const root = document.documentElement;
    const resolved = resolveTheme(theme);

    // Apply theme without transition on initial load
    applyTheme(resolved, false);

    // Mark theme as loaded to enable transitions on subsequent changes
    // Use requestAnimationFrame to ensure this happens after paint
    requestAnimationFrame(() => {
      root.classList.add(LOADED_CLASS);
    });
    // Only run on mount - theme state is already initialized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleChange = () => {
      if (theme === "system") {
        const newResolved = getSystemTheme();
        setResolvedTheme(newResolved);
        applyTheme(newResolved, true);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Sync with Whop's frosted-ui theme changes
  useEffect(() => {
    const handleWhopTheme = (e: Event) => {
      if (e instanceof CustomEvent && e.detail?.appearance) {
        const appearance = e.detail.appearance as ResolvedTheme;
        setThemeState(appearance);
        setResolvedTheme(appearance);
        applyTheme(appearance, true);
      }
    };

    document.documentElement.addEventListener(
      "frosted-ui:set-theme",
      handleWhopTheme,
    );
    return () =>
      document.documentElement.removeEventListener(
        "frosted-ui:set-theme",
        handleWhopTheme,
      );
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!isDev) return;
      setThemeState(newTheme);
      const resolved: ResolvedTheme =
        newTheme === "system" ? getSystemTheme() : newTheme;
      setResolvedTheme(resolved);

      applyTheme(resolved, true);
      saveThemeToStorage(newTheme);
    },
    [isDev],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

const defaultThemeValue: ThemeContextValue = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context ?? defaultThemeValue;
}
