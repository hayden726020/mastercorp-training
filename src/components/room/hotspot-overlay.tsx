"use client";

import type { RoomArea, PointCoordinates } from "@/types";
import HotspotMarker from "./hotspot-marker";
import { t } from "@/lib/locales/zh";

interface HotspotOverlayProps {
  areas: RoomArea[];
  onAreaClick?: (area: RoomArea) => void;
  /** Set of area IDs that should be draggable */
  draggableAreaIds?: Set<string>;
  /** Called when a draggable marker is repositioned */
  onAreaPositionChange?: (areaId: string, coords: PointCoordinates) => void;
}

export default function HotspotOverlay({
  areas,
  onAreaClick,
  draggableAreaIds,
  onAreaPositionChange,
}: HotspotOverlayProps) {
  if (areas.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-button">
          {t("hotspot.no_areas")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      aria-label={t("hotspot.room_hotspots")}
    >
      {areas.map((area) => {
        const isDraggable = draggableAreaIds?.has(area.id) ?? false;

        return (
          <HotspotMarker
            key={area.id}
            area={area}
            onClick={onAreaClick}
            draggable={isDraggable}
            onPositionChange={
              isDraggable
                ? (coords) => onAreaPositionChange?.(area.id, coords)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
