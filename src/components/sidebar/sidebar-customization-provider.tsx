"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  CustomizationContext,
  type NavCustomization,
  type AreaOverride,
  type SectionOverride,
} from "@/hooks/use-sidebar-customization";

const STORAGE_KEY = "sidebar-nav-customization";

function loadCustomization(): NavCustomization {
  if (typeof window === "undefined") return { version: 1, areas: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, areas: {} };
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1) return parsed;
  } catch {}
  return { version: 1, areas: {} };
}

function saveCustomization(data: NavCustomization) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function SidebarCustomizationProvider({ children }: { children: ReactNode }) {
  const [customization, setCustomization] = useState<NavCustomization>(() =>
    loadCustomization(),
  );

  // Persist on change
  useEffect(() => {
    saveCustomization(customization);
  }, [customization]);

  const getAreaOverride = useCallback(
    (areaKey: string) => customization.areas[areaKey],
    [customization],
  );

  const ensureArea = (
    prev: NavCustomization,
    areaKey: string,
    sections: { name?: string; items: { name: string }[] }[],
  ): AreaOverride => {
    if (prev.areas[areaKey]) return prev.areas[areaKey];
    // Bootstrap from current static content
    return {
      sections: sections.map((s) => ({
        sectionName: s.name ?? "",
        itemOrder: s.items.map((i) => i.name),
        hiddenItems: [],
      })),
    };
  };

  const reorderItem = useCallback(
    (
      areaKey: string,
      sectionName: string,
      oldIndex: number,
      newIndex: number,
    ) => {
      setCustomization((prev) => {
        const area = prev.areas[areaKey];
        if (!area) return prev;
        const sections = area.sections.map((s) => {
          if (s.sectionName !== sectionName) return s;
          const order = [...s.itemOrder];
          const [moved] = order.splice(oldIndex, 1);
          order.splice(newIndex, 0, moved);
          return { ...s, itemOrder: order };
        });
        return {
          ...prev,
          areas: { ...prev.areas, [areaKey]: { sections } },
        };
      });
    },
    [],
  );

  const moveItemToSection = useCallback(
    (
      areaKey: string,
      fromSection: string,
      toSection: string,
      itemName: string,
      newIndex: number,
    ) => {
      setCustomization((prev) => {
        const area = prev.areas[areaKey];
        if (!area) return prev;
        const sections = area.sections.map((s) => {
          if (s.sectionName === fromSection) {
            return {
              ...s,
              itemOrder: s.itemOrder.filter((n) => n !== itemName),
              hiddenItems: s.hiddenItems.filter((n) => n !== itemName),
            };
          }
          if (s.sectionName === toSection) {
            const order = [...s.itemOrder];
            order.splice(newIndex, 0, itemName);
            return { ...s, itemOrder: order };
          }
          return s;
        });
        return {
          ...prev,
          areas: { ...prev.areas, [areaKey]: { sections } },
        };
      });
    },
    [],
  );

  const toggleVisibility = useCallback(
    (areaKey: string, sectionName: string, itemName: string) => {
      setCustomization((prev) => {
        const area = prev.areas[areaKey];
        if (!area) return prev;
        const sections = area.sections.map((s) => {
          if (s.sectionName !== sectionName) return s;
          const hidden = s.hiddenItems.includes(itemName)
            ? s.hiddenItems.filter((n) => n !== itemName)
            : [...s.hiddenItems, itemName];
          return { ...s, hiddenItems: hidden };
        });
        return {
          ...prev,
          areas: { ...prev.areas, [areaKey]: { sections } },
        };
      });
    },
    [],
  );

  const resetArea = useCallback((areaKey: string) => {
    setCustomization((prev) => {
      const { [areaKey]: _, ...rest } = prev.areas;
      return { ...prev, areas: rest };
    });
  }, []);

  const initializeArea = useCallback(
    (
      areaKey: string,
      sections: { name?: string; items: { name: string }[] }[],
    ) => {
      setCustomization((prev) => {
        if (prev.areas[areaKey]) return prev;
        return {
          ...prev,
          areas: {
            ...prev.areas,
            [areaKey]: {
              sections: sections.map((s) => ({
                sectionName: s.name ?? "",
                itemOrder: s.items.map((i) => i.name),
                hiddenItems: [],
              })),
            },
          },
        };
      });
    },
    [],
  );

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        getAreaOverride,
        reorderItem,
        moveItemToSection,
        toggleVisibility,
        resetArea,
        initializeArea,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export { type AreaOverride, type SectionOverride };
