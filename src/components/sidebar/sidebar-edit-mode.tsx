"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useCallback, useRef } from "react";
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { NavItemType } from "./sidebar-nav";
import { useSidebarCustomization } from "@/hooks/use-sidebar-customization";
import { useSideNav } from "./sidebar-context";

// ── Grip Handle Icon ────────────────────────────────────────────────

function GripIcon({ className }: { className?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" className={className}>
      <circle cx="2" cy="2" r="1.25" />
      <circle cx="6" cy="2" r="1.25" />
      <circle cx="2" cy="7" r="1.25" />
      <circle cx="6" cy="7" r="1.25" />
      <circle cx="2" cy="12" r="1.25" />
      <circle cx="6" cy="12" r="1.25" />
    </svg>
  );
}

// ── Eye Icons ───────────────────────────────────────────────────────

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

// ── Sortable Item ───────────────────────────────────────────────────

function SortableNavItem({
  item,
  isHidden,
  onToggleVisibility,
  id,
}: {
  item: NavItemType;
  isHidden: boolean;
  onToggleVisibility: () => void;
  id: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { item } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex h-8 items-center gap-1 rounded-xl px-1",
        isDragging && "z-50 bg-sidebar-bg shadow-lg ring-1 ring-sidebar-border",
        !isDragging && isHidden && "opacity-40",
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-sidebar-text-muted transition-colors hover:text-sidebar-text-subtle active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripIcon className="size-2.5" />
      </button>

      {/* Icon + name */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-1">
        <Icon className="size-4 shrink-0 opacity-50" data-hovered={false} />
        <span className="truncate text-sm font-medium tracking-[-0.02em] text-sidebar-text-subtle font-[family-name:var(--font-inter)]">
          {item.name}
        </span>
      </div>

      {/* Visibility toggle */}
      <button
        type="button"
        onClick={onToggleVisibility}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-sidebar-text-muted transition-colors hover:text-sidebar-text-subtle"
      >
        {isHidden ? (
          <EyeOffIcon className="size-3.5" />
        ) : (
          <EyeIcon className="size-3.5" />
        )}
      </button>
    </div>
  );
}

// ── Droppable Section ───────────────────────────────────────────────

function DroppableSection({
  sectionName,
  ids,
  children,
  isOver,
}: {
  sectionName: string;
  ids: string[];
  children: React.ReactNode;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `section::${sectionName}` });

  return (
    <div ref={setNodeRef}>
      {sectionName && (
        <div className={cn(
          "mb-2 pl-[10px] pt-2 font-[family-name:var(--font-inter)] text-[11px] font-normal tracking-[-0.02em] text-sidebar-section-label transition-colors",
          isOver && "text-sidebar-text",
        )}>
          {sectionName}
        </div>
      )}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={cn(
          "flex flex-col gap-0.5 rounded-xl p-0.5 transition-colors",
          isOver && "bg-sidebar-active/50",
        )}>
          {children}
          {ids.length === 0 && (
            <div className="flex h-8 items-center justify-center rounded-xl border border-dashed border-sidebar-border text-xs text-sidebar-text-muted">
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}


// ── Edit Mode Content ───────────────────────────────────────────────

type EditSection = {
  name: string;
  items: NavItemType[];
  hiddenSet: Set<string>;
  ids: string[];
};

export function EditModeContent({
  areaKey,
  sections,
}: {
  areaKey: string;
  sections: {
    name?: string;
    items: NavItemType[];
  }[];
}) {
  const { getAreaOverride, reorderItem, moveItemToSection, toggleVisibility, resetArea, initializeArea } =
    useSidebarCustomization();
  const { setEditMode } = useSideNav();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overSectionId, setOverSectionId] = useState<string | null>(null);

  // Bootstrap override from static content if not yet initialized
  useEffect(() => {
    initializeArea(areaKey, sections);
  }, [areaKey, sections, initializeArea]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const areaOverride = getAreaOverride(areaKey);

  // Build a global lookup of all items by name
  const allItemsMap = useMemo(() => {
    const map = new Map<string, NavItemType>();
    for (const section of sections) {
      for (const item of section.items) {
        map.set(item.name, item);
      }
    }
    return map;
  }, [sections]);

  // Build sections from override (supports cross-section moves)
  const editSections: EditSection[] = useMemo(() => {
    return sections.map((section) => {
      const sectionKey = section.name ?? "";
      const override = areaOverride?.sections.find(
        (s) => s.sectionName === sectionKey,
      );
      const hiddenSet = new Set(override?.hiddenItems ?? []);

      let items: NavItemType[];
      if (override?.itemOrder.length) {
        // Rebuild items from override order, looking up from global pool
        items = [];
        for (const name of override.itemOrder) {
          const item = allItemsMap.get(name);
          if (item) items.push(item);
        }
      } else {
        items = section.items;
      }

      return {
        name: sectionKey,
        items,
        hiddenSet,
        ids: items.map((i) => `${sectionKey}::${i.name}`),
      };
    });
  }, [sections, areaOverride, allItemsMap]);

  // Find which section an id belongs to
  const findSection = useCallback(
    (id: string): EditSection | undefined => {
      // Check if it's a section droppable id
      if (typeof id === "string" && id.startsWith("section::")) {
        const name = id.replace("section::", "");
        return editSections.find((s) => s.name === name);
      }
      // Otherwise it's an item id
      return editSections.find((s) => s.ids.includes(id));
    },
    [editSections],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setOverSectionId(null);
      return;
    }
    const section = findSection(over.id as string);
    setOverSectionId(section?.name ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setOverSectionId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    const activeSection = findSection(activeIdStr);
    const overSection = findSection(overIdStr);

    if (!activeSection || !overSection) return;

    const activeItemName = activeIdStr.split("::").slice(1).join("::");

    if (activeSection.name === overSection.name) {
      // Same section reorder
      if (activeIdStr === overIdStr) return;
      const oldIndex = activeSection.ids.indexOf(activeIdStr);
      const newIndex = activeSection.ids.indexOf(overIdStr);
      if (oldIndex === -1 || newIndex === -1) return;
      reorderItem(areaKey, activeSection.name, oldIndex, newIndex);
    } else {
      // Cross-section move
      let newIndex = overSection.ids.indexOf(overIdStr);
      if (newIndex === -1) newIndex = overSection.items.length; // dropped on section itself
      moveItemToSection(
        areaKey,
        activeSection.name,
        overSection.name,
        activeItemName,
        newIndex,
      );
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverSectionId(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {editSections.map((section) => (
          <DroppableSection
            key={section.name}
            sectionName={section.name}
            ids={section.ids}
            isOver={overSectionId === section.name && findSection(activeId ?? "")?.name !== section.name}
          >
            {section.items.map((item) => {
              const id = `${section.name}::${item.name}`;
              return (
                <SortableNavItem
                  key={id}
                  id={id}
                  item={item}
                  isHidden={section.hiddenSet.has(item.name)}
                  onToggleVisibility={() =>
                    toggleVisibility(areaKey, section.name, item.name)
                  }
                />
              );
            })}
          </DroppableSection>
        ))}

      </DndContext>

      {/* Toolbar */}
      <div className="mt-2 flex items-center justify-between border-t border-sidebar-border px-1 pt-3">
        <button
          type="button"
          onClick={() => resetArea(areaKey)}
          className="cursor-pointer text-xs font-medium text-sidebar-text-muted transition-colors hover:text-sidebar-text-subtle"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setEditMode(false)}
          className="cursor-pointer rounded-lg bg-sidebar-active px-3 py-1.5 text-xs font-medium text-sidebar-text transition-colors hover:bg-sidebar-hover"
        >
          Done
        </button>
      </div>
    </div>
  );
}
