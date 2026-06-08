"use client";

import { useState, useCallback, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import type { PointCoordinates, RoomType, RoomArea, AreaContent } from "@/types";
import RoomPanorama from "./room-panorama";
import HotspotOverlay from "./hotspot-overlay";
import AreaQuickLinks from "./area-quick-links";
import AreaDetailSheet from "./area-detail-sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getContentByArea } from "@/data";
import { cn } from "@/lib/utils";

interface RoomOverviewProps {
  room: RoomType;
  areas: RoomArea[];
}

export default function RoomOverview({ room, areas }: RoomOverviewProps) {
  const [selectedArea, setSelectedArea] = useState<RoomArea | null>(null);
  const [copied, setCopied] = useState(false);

  // Track user-adjusted positions for draggable markers
  const [adjustedPositions, setAdjustedPositions] = useState<
    Record<string, PointCoordinates>
  >({});

  // Merge adjusted positions into the areas list
  const effectiveAreas = useMemo(
    () =>
      areas.map((a) => {
        const adjusted = adjustedPositions[a.id];
        return adjusted ? { ...a, coordinates: { ...adjusted } } : a;
      }),
    [areas, adjustedPositions]
  );

  // ── All areas are draggable so the user can reposition them ──
  const draggableAreaIds = useMemo(
    () => new Set(areas.map((a) => a.id)),
    [areas]
  );

  const handleAreaClick = useCallback((area: RoomArea) => {
    setSelectedArea(area);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedArea(null);
    }
  }, []);

  const handleAreaPositionChange = useCallback(
    (areaId: string, coords: PointCoordinates) => {
      setAdjustedPositions((prev) => ({ ...prev, [areaId]: coords }));
    },
    []
  );

  const areaContent: AreaContent | null = selectedArea
    ? (getContentByArea(selectedArea.id) ?? null)
    : null;

  // ── Build coordinate export (sorted by area name) ──
  const coordinateExport = useMemo(() => {
    const entries = effectiveAreas
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((a) => {
        const coords = a.coordinates as PointCoordinates;
        return {
          id: a.id,
          name: a.name,
          x: coords.x,
          y: coords.y,
        };
      });
    return JSON.stringify(entries, null, 2);
  }, [effectiveAreas]);

  const handleCopyCoords = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(coordinateExport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS or older browsers
      const ta = document.createElement("textarea");
      ta.value = coordinateExport;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [coordinateExport]);

  const hasAdjustments = Object.keys(adjustedPositions).length > 0;

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
          draggableAreaIds={draggableAreaIds}
          onAreaPositionChange={handleAreaPositionChange}
        />
      </RoomPanorama>

      {/* Quick links to all areas */}
      <AreaQuickLinks areas={effectiveAreas} onAreaClick={handleAreaClick} />

      {/* ── Coordinate export panel ── */}
      <div className="rounded-card border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hotspot Coordinates
            </span>
            {hasAdjustments && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                {Object.keys(adjustedPositions).length} adjusted
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyCoords}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button",
              "text-xs font-medium",
              "transition-colors duration-150",
              copied
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {copied ? (
              <>
                <Check size={12} strokeWidth={3} />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} strokeWidth={2} />
                Copy JSON
              </>
            )}
          </button>
        </div>
        <pre className="text-xs font-mono bg-muted/50 rounded-button p-3 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre">
          {coordinateExport}
        </pre>
        <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
          Drag markers on the panorama above to reposition. Coordinates are
          percentages (0-100) relative to the original image dimensions.
          {hasAdjustments &&
            " Adjusted values are shown in the JSON above."}
        </p>
      </div>

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
