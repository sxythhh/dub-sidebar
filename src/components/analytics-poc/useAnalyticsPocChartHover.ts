"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";

export interface AnalyticsPocChartHoverPoint {
  index: number;
  x: number;
  label: string;
}

interface RechartsHoverState {
  isTooltipActive?: boolean;
  activeTooltipIndex?: number | string;
  activeCoordinate?: {
    x?: number | string;
  };
  activePayload?: Array<{
    payload?: {
      label?: string;
    };
  }>;
}

interface UseAnalyticsPocChartHoverOptions {
  chartContainerRef: RefObject<HTMLElement | null>;
  data: Array<{
    label: string;
  }>;
  isEnabled: boolean;
}

function toFiniteNumber(value: number | string | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function isTouchPointerEnvironment() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function normalizeHoverState(
  eventState: unknown,
  data: Array<{ label: string }>,
): AnalyticsPocChartHoverPoint | null {
  if (!eventState || typeof eventState !== "object") {
    return null;
  }

  const {
    activeCoordinate,
    activePayload,
    activeTooltipIndex,
    isTooltipActive,
  } = eventState as RechartsHoverState;

  if (!isTooltipActive) {
    return null;
  }

  const index = toFiniteNumber(activeTooltipIndex);
  const x = toFiniteNumber(activeCoordinate?.x);

  if (index === undefined || x === undefined) {
    return null;
  }

  if (index < 0 || index >= data.length) {
    return null;
  }

  const payloadLabel = activePayload?.[0]?.payload?.label;
  const fallbackLabel = data[index]?.label;
  const label = payloadLabel ?? fallbackLabel;

  if (!label) {
    return null;
  }

  return { index, label, x };
}

export function useAnalyticsPocChartHover({
  chartContainerRef,
  data,
  isEnabled,
}: UseAnalyticsPocChartHoverOptions) {
  const [transientHover, setTransientHover] =
    useState<AnalyticsPocChartHoverPoint | null>(null);
  const [pinnedHover, setPinnedHover] =
    useState<AnalyticsPocChartHoverPoint | null>(null);

  useEffect(() => {
    if (isEnabled) {
      return;
    }

    setTransientHover(null);
    setPinnedHover(null);
  }, [isEnabled]);

  useEffect(() => {
    if (!pinnedHover) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = chartContainerRef.current;
      const target = event.target;

      if (!container || !(target instanceof Node)) {
        return;
      }

      if (container.contains(target)) {
        return;
      }

      setPinnedHover(null);
      setTransientHover(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [chartContainerRef, pinnedHover]);

  // Native mouseleave fallback — Recharts' onMouseLeave can miss fast exits
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !isEnabled) return;

    const handleNativeLeave = () => {
      if (!pinnedHover) {
        setTransientHover(null);
      }
    };

    container.addEventListener("mouseleave", handleNativeLeave);
    return () => container.removeEventListener("mouseleave", handleNativeLeave);
  }, [chartContainerRef, isEnabled, pinnedHover]);

  useEffect(() => {
    if (pinnedHover && pinnedHover.index >= data.length) {
      setPinnedHover(null);
    }

    if (transientHover && transientHover.index >= data.length) {
      setTransientHover(null);
    }
  }, [data.length, pinnedHover, transientHover]);

  const handleMouseMove = (eventState: unknown) => {
    if (!isEnabled || pinnedHover) {
      return;
    }

    setTransientHover(normalizeHoverState(eventState, data));
  };

  const handleMouseLeave = () => {
    if (!isEnabled || pinnedHover) {
      return;
    }

    setTransientHover(null);
  };

  const handleChartClick = (eventState: unknown) => {
    if (!isEnabled || !isTouchPointerEnvironment()) {
      return;
    }

    const nextHoverPoint = normalizeHoverState(eventState, data);
    if (!nextHoverPoint) {
      setPinnedHover(null);
      setTransientHover(null);
      return;
    }

    setPinnedHover((previousPinnedHover) => {
      if (previousPinnedHover?.index === nextHoverPoint.index) {
        return null;
      }

      return nextHoverPoint;
    });
    setTransientHover(null);
  };

  const activeHover = useMemo(
    () => pinnedHover ?? transientHover,
    [pinnedHover, transientHover],
  );

  return {
    activeHover,
    handleChartClick,
    handleMouseLeave,
    handleMouseMove,
    pinnedHover,
    transientHover,
  };
}
