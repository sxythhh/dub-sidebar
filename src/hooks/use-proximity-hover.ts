"use client";

import { useRef, useState, useCallback, useEffect, type RefObject } from "react";

export interface ItemRect {
  top: number;
  height: number;
  left: number;
  width: number;
}

interface UseProximityHoverReturn {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  itemRects: ItemRect[];
  sessionRef: RefObject<number>;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  registerItem: (index: number, element: HTMLElement | null) => void;
  measureItems: () => void;
}

export function useProximityHover<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
): UseProximityHoverReturn {
  const itemsRef = useRef(new Map<number, HTMLElement>());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [itemRects, setItemRects] = useState<ItemRect[]>([]);
  const sessionRef = useRef(0);

  const registerItem = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(index, element);
      } else {
        itemsRef.current.delete(index);
      }
    },
    []
  );

  const measureItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const borderTop = container.clientTop;
    const borderLeft = container.clientLeft;
    const rects: ItemRect[] = [];
    itemsRef.current.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      rects[index] = {
        top: rect.top - containerRect.top - borderTop,
        height: rect.height,
        left: rect.left - containerRect.left - borderLeft,
        width: rect.width,
      };
    });
    setItemRects(rects);
  }, [containerRef]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const borderTop = container.clientTop;
      const borderLeft = container.clientLeft;
      const mouseY = e.clientY;

      let closestIndex: number | null = null;
      let closestDistance = Infinity;
      const rects: ItemRect[] = [];

      itemsRef.current.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        rects[index] = {
          top: rect.top - containerRect.top - borderTop,
          height: rect.height,
          left: rect.left - containerRect.left - borderLeft,
          width: rect.width,
        };

        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(mouseY - itemCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setItemRects(rects);
      setActiveIndex(closestIndex);
    },
    [containerRef]
  );

  const handleMouseEnter = useCallback(() => {
    sessionRef.current += 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return {
    activeIndex,
    setActiveIndex,
    itemRects,
    sessionRef,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    registerItem,
    measureItems,
  };
}
