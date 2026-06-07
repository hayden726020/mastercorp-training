"use client";

import { useState, useCallback, useMemo } from "react";
import type { RoomType, RoomArea, AreaContent, PointCoordinates } from "@/types";
import RoomPanorama from "./room-panorama";
import HotspotOverlay from "./hotspot-overlay";
import AreaQuickLinks from "./area-quick-links";
import AreaDetailSheet from "./area-detail-sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getContentByArea } from "@/data";

// ── Area IDs that should be draggable (user can reposition) ──
const DRAGGABLE_AREA_IDS: Set<string> = new Set();

interface RoomOverviewProps {
  room: RoomType;
  areas: RoomArea[];
}

export default function RoomOverview({ room, areas }: RoomOverviewProps) {
  const [selectedArea, setSelectedArea] = useState<RoomArea | null>(null);

  // Track user-adjusted positions for draggable markers
  const [adjustedPositions, setAdjustedPositions] = useState<
    Record<string, PointCoordinates>
  >({});

  // Merge adjusted positions into the areas list
  const effectiveAreas = useMemo(
    () =>
      areas.map((a) => {
        const adjusted = adjustedPositions[a.id];
        return adjusted
          ? { ...a, coordinates: { ...adjusted } }
          : a;
      }),
    [areas, adjustedPositions]
  );

  const handleAreaClick = useCallback((area: RoomArea) => {
    console.log("🟢 [room-overview] handleAreaClick — area:", area.id);
    setSelectedArea(area);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    // ── CLOSE FLOW LOGGING ──
    console.log("╔══════════════════════════════════════╗");
    console.log("║ [room-overview] handleOpenChange     ║");
    console.log("╠══════════════════════════════════════╣");
    console.log("║ open =", open);
    console.log("║ selectedArea =", selectedArea?.id ?? null);
    console.log("║ document.body.className =", document.body.className);
    console.log("║ [data-dialog-backdrop] =", document.querySelectorAll("[data-dialog-backdrop]").length);
    console.log("║ [data-dialog-backdrop] els =", document.querySelectorAll("[data-dialog-backdrop]"));
    console.log("╚══════════════════════════════════════╝");

    if (!open) {
      console.log("🔴 [room-overview] setSelectedArea(null) — CLOSING");
      setSelectedArea(null);

      // ── Check DOM after React commits the state change ──
      setTimeout(() => {
        console.log("⏱️ [room-overview] 350ms AFTER close — DOM CHECK");
        console.log("  document.body.className =", document.body.className);
        console.log("  [data-dialog-backdrop] count =", document.querySelectorAll("[data-dialog-backdrop]").length);
        console.log("  [data-dialog-backdrop] els =", document.querySelectorAll("[data-dialog-backdrop]"));
        console.log("  All body children:");
        document.body.childNodes.forEach((c, i) => {
          if (c.nodeType === 1) {
            const el = c as Element;
            console.log(`    [${i}] <${el.tagName}> class="${el.className}" data-*=${Array.from(el.attributes).filter(a => a.name.startsWith("data-")).map(a => `${a.name}="${a.value}"`).join(", ") || "(none)"}`);
          }
        });
      }, 350);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAreaPositionChange = useCallback(
    (areaId: string, coords: PointCoordinates) => {
      setAdjustedPositions((prev) => ({ ...prev, [areaId]: coords }));
    },
    []
  );

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
          draggableAreaIds={DRAGGABLE_AREA_IDS}
          onAreaPositionChange={handleAreaPositionChange}
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
            <AreaDetailSheet area={selectedArea} content={areaContent} roomSlug={room.slug} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
