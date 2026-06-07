"use client";

import { useRef, useCallback } from "react";
import {
  Bed,
  Bath,
  Coffee,
  Tv,
  DoorOpen,
  Monitor,
  CookingPot,
  MapPin,
  GripVertical,
} from "lucide-react";
import { ToiletIcon, WashbasinIcon } from "./custom-icons";
import { cn } from "@/lib/utils";
import type { RoomArea, PointCoordinates } from "@/types";
import { t } from "@/lib/locales/zh";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIcon = React.ComponentType<any>;

export const iconMap: Record<string, AnyIcon> = {
  bed: Bed,
  bath: Bath,
  coffee: Coffee,
  tv: Tv,
  "door-open": DoorOpen,
  monitor: Monitor,
  kitchen: CookingPot,
  toilet: ToiletIcon,
  washbasin: WashbasinIcon,
};

interface HotspotMarkerProps {
  area: RoomArea;
  onClick?: (area: RoomArea) => void;
  /** When true, the marker can be dragged to reposition */
  draggable?: boolean;
  /** Called when the marker is dragged to a new position (x, y in 0-100%) */
  onPositionChange?: (coords: PointCoordinates) => void;
}

/** Pixels of movement before a drag is recognised (vs a click) */
const DRAG_THRESHOLD = 4;

export default function HotspotMarker({
  area,
  onClick,
  draggable = false,
  onPositionChange,
}: HotspotMarkerProps) {
  const coords = area.coordinates as PointCoordinates;
  const Icon = iconMap[area.iconType] ?? MapPin;

  // Track drag state
  const dragRef = useRef({
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
  });

  const getContainer = (el: HTMLElement): HTMLElement | null =>
    el.closest<HTMLElement>('[data-hotspot-container]');

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return;

      const container = getContainer(e.currentTarget as HTMLElement);
      if (!container) return;

      // Only respond to primary pointer (mouse left / first touch)
      if (!e.isPrimary) return;

      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragRef.current = {
        isDragging: true,
        hasMoved: false,
        startX: e.clientX,
        startY: e.clientY,
      };
    },
    [draggable]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.isDragging) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      // Only start moving after threshold
      if (!dragRef.current.hasMoved) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
          return;
        }
        dragRef.current.hasMoved = true;
      }

      e.preventDefault();

      const container = getContainer(e.currentTarget as HTMLElement);
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // Clamp to 0-100
      const clamped: PointCoordinates = {
        x: Math.round(Math.max(0, Math.min(100, xPct))),
        y: Math.round(Math.max(0, Math.min(100, yPct))),
      };

      onPositionChange?.(clamped);
    },
    [onPositionChange]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current.isDragging) return;

    dragRef.current.isDragging = false;

    // If the pointer barely moved, treat it as a click
    if (!dragRef.current.hasMoved) {
      onClick?.(area);
    }
  }, [onClick, area]);

  const handleClick = () => {
    // Only fire for non-draggable markers (draggable ones handled in pointerUp)
    if (!draggable) {
      onClick?.(area);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(area);
    }
  };

  const displayName = area.nameZh ? `${area.nameZh} · ${area.name}` : area.name;
  const displayDesc = area.descriptionZh
    ? `${area.descriptionZh} · ${area.description}`
    : area.description;

  return (
    <div
      className="absolute"
      style={{
        left: `${coords.x}%`,
        top: `${coords.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        type="button"
        className={cn(
          "group relative flex flex-col items-center justify-center gap-0.5",
          "min-w-[44px] min-h-[44px]",
          "touch-auto",
          "transition-transform duration-200 ease-out-expo",
          !draggable && "hover:scale-110",
          draggable && "cursor-grab",
          "focus-visible:outline-none"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        // Only attach pointer handlers when draggable — avoids
        // interfering with native click synthesis on touch devices.
        {...(draggable
          ? {
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: handlePointerUp,
            }
          : {})}
        aria-label={
          draggable
            ? `${displayName} ${t("hotspot.draggable")}: ${displayDesc}`
            : `${displayName}: ${displayDesc}`
        }
      >
        {/* Breathe ring — scale only, no opacity change */}
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-primary/20",
            "animate-ring-breathe",
            "motion-reduce:animate-none",
            "pointer-events-none"
          )}
          style={{ width: 44, height: 44, margin: "auto" }}
          aria-hidden="true"
        />

        {/* Icon circle */}
        <span
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-full",
            "bg-primary text-primary-foreground shadow-md",
            "transition-colors duration-200",
            draggable
              ? "bg-accent text-accent-foreground group-hover:bg-accent/90"
              : "group-hover:bg-primary/90",
            "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
          )}
          aria-hidden="true"
        >
          <Icon size={14} strokeWidth={2.5} />
        </span>

        {/* Drag handle — shown below icon when draggable */}
        {draggable && (
          <span
            className="relative flex items-center justify-center w-5 h-5 -mt-0.5 rounded-full bg-accent/15 text-accent"
            aria-hidden="true"
          >
            <GripVertical size={10} strokeWidth={2.5} />
          </span>
        )}

        {/* Label — visible on hover (desktop) and focus-within (mobile tap) */}
        <span
          className={cn(
            "absolute top-full mt-1",
            "max-w-[140px] sm:max-w-[200px]",
            "text-[10px] sm:text-xs font-medium text-foreground leading-tight",
            "bg-background/90 backdrop-blur px-2 py-0.5 rounded-button shadow-sm",
            "invisible group-hover:visible group-focus-within:visible",
            "whitespace-nowrap overflow-hidden text-ellipsis",
            "pointer-events-none select-none"
          )}
          aria-hidden="true"
        >
          {displayName}
          {draggable && (
            <span className="ml-1 text-accent" aria-hidden="true">
              ↕
            </span>
          )}
        </span>

        {/* Coordinate readout — always visible when draggable */}
        {draggable && (
          <span
            className={cn(
              "absolute top-full mt-7 whitespace-nowrap",
              "text-[10px] font-mono font-medium",
              "bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm shadow-sm",
              "pointer-events-none select-none"
            )}
            aria-live="polite"
          >
            x:{coords.x} y:{coords.y}
          </span>
        )}
      </button>
    </div>
  );
}
