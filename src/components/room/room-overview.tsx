"use client";

import { useState, useCallback, useMemo } from "react";
import type { RoomType, RoomArea, AreaContent } from "@/types";
import RoomPanorama from "./room-panorama";
import HotspotOverlay from "./hotspot-overlay";
import AreaQuickLinks from "./area-quick-links";
import AreaDetailSheet from "./area-detail-sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getContentByArea } from "@/data";
import { useOrientation } from "@/hooks/use-orientation";

interface RoomOverviewProps {
  room: RoomType;
  areas: RoomArea[];
}

export default function RoomOverview({ room, areas }: RoomOverviewProps) {
  const [selectedArea, setSelectedArea] = useState<RoomArea | null>(null);

  // Detect screen orientation to select the correct coordinate set.
  // portrait → use coordinatesPortrait (falls back to coordinates)
  // landscape → use coordinates (the default)
  const orientation = useOrientation();

  // Apply orientation-specific coordinate overrides
  const effectiveAreas = useMemo(
    () =>
      orientation === "portrait"
        ? areas.map((a) =>
            a.coordinatesPortrait
              ? { ...a, coordinates: a.coordinatesPortrait }
              : a
          )
        : areas,
    [areas, orientation]
  );

  const handleAreaClick = useCallback((area: RoomArea) => {
    setSelectedArea(area);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedArea(null);
    }
  }, []);

  const areaContent: AreaContent | null = selectedArea
    ? (getContentByArea(selectedArea.id) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Panorama + Hotspots */}
      <RoomPanorama
        src={room.panoramaImage}
        alt={`${room.name} — Panorama view`}
      >
        <HotspotOverlay
          areas={effectiveAreas}
          onAreaClick={handleAreaClick}
        />
      </RoomPanorama>

      {/* Quick links to all areas */}
      <AreaQuickLinks areas={effectiveAreas} onAreaClick={handleAreaClick} />

      {/* Area Detail Dialog */}
      <Dialog open={!!selectedArea} onOpenChange={handleOpenChange}>
        <DialogContent
          key={selectedArea?.id ?? "closed"}
          open={!!selectedArea}
          className="md:max-w-4xl"
        >
          {selectedArea && (
            <AreaDetailSheet
              area={selectedArea}
              content={areaContent}
              roomSlug={room.slug}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
