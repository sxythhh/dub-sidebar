"use client";

import {
  createContext,
  useContext,
} from "react";

// ── Types ───────────────────────────────────────────────────────────

export type NavSection = {
  name?: string;
  items: { name: string; [key: string]: unknown }[];
};

type SectionOverride = {
  sectionName: string;
  itemOrder: string[];  // item names — this is the source of truth for which items belong here
  hiddenItems: string[];
};

type AreaOverride = {
  sections: SectionOverride[];
};

type NavCustomization = {
  version: 1;
  areas: Record<string, AreaOverride>;
};

// ── Pure apply function ─────────────────────────────────────────────

/**
 * Applies customization overrides to static nav content.
 * Items can be reordered, hidden, and moved between sections.
 * The override's itemOrder is the source of truth for section membership.
 */
export function applyCustomization(
  staticContent: NavSection[],
  areaOverride: AreaOverride | undefined,
): NavSection[] {
  if (!areaOverride) return staticContent;

  // Build a lookup of all items by name from all sections
  const allItems = new Map<string, NavSection["items"][0]>();
  for (const section of staticContent) {
    for (const item of section.items) {
      allItems.set(item.name, item);
    }
  }

  return staticContent.map((section) => {
    const sectionKey = section.name ?? "";
    const override = areaOverride.sections.find(
      (s) => s.sectionName === sectionKey,
    );
    if (!override) return section;

    const hiddenSet = new Set(override.hiddenItems);

    // Build items from the override's itemOrder, looking up from the global pool
    const items: NavSection["items"] = [];
    for (const name of override.itemOrder) {
      const item = allItems.get(name);
      if (item && !hiddenSet.has(name)) {
        items.push(item);
      }
    }

    return { ...section, items };
  });
}

// ── Context ─────────────────────────────────────────────────────────

type CustomizationContextType = {
  customization: NavCustomization;
  getAreaOverride: (areaKey: string) => AreaOverride | undefined;
  reorderItem: (
    areaKey: string,
    sectionName: string,
    oldIndex: number,
    newIndex: number,
  ) => void;
  moveItemToSection: (
    areaKey: string,
    fromSection: string,
    toSection: string,
    itemName: string,
    newIndex: number,
  ) => void;
  toggleVisibility: (
    areaKey: string,
    sectionName: string,
    itemName: string,
  ) => void;
  resetArea: (areaKey: string) => void;
  initializeArea: (
    areaKey: string,
    sections: { name?: string; items: { name: string }[] }[],
  ) => void;
};

const CustomizationContext = createContext<CustomizationContextType | null>(
  null,
);

export function useSidebarCustomization() {
  const ctx = useContext(CustomizationContext);
  if (!ctx)
    throw new Error(
      "useSidebarCustomization must be used within SidebarCustomizationProvider",
    );
  return ctx;
}

export { CustomizationContext };
export type { NavCustomization, AreaOverride, SectionOverride, CustomizationContextType };
