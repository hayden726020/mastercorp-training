"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { RoomArea } from "@/types";
import { iconMap } from "./hotspot-marker";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

interface RelatedAreasLinksProps {
  areas: RoomArea[];
  currentAreaId: string;
  roomSlug: string;
}

export default function RelatedAreasLinks({
  areas,
  currentAreaId,
  roomSlug,
}: RelatedAreasLinksProps) {
  const relatedAreas = areas.filter((a) => a.id !== currentAreaId);

  if (relatedAreas.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
        {t("area.related_areas")}
      </span>
      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1",
          "[&::-webkit-scrollbar]:hidden",
          "[-ms-overflow-style:none]",
          "[scrollbar-width:none]"
        )}
        role="list"
        aria-label={t("area.related_areas_label")}
      >
        {relatedAreas.map((area) => {
          const Icon = iconMap[area.iconType] ?? MapPin;
          const displayName = area.nameZh ? `${area.nameZh} · ${area.name}` : area.name;
          return (
            <Link
              key={area.id}
              href={ROUTES.AREA_DETAIL(roomSlug, area.id)}
              className={cn(
                "flex items-center gap-1.5 shrink-0",
                "px-3 py-2.5 rounded-button min-h-[44px]",
                "bg-card border border-border",
                "text-sm font-medium text-foreground",
                "hover:bg-muted/50 hover:border-primary/30",
                "active:scale-95",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              role="listitem"
            >
              <Icon size={14} strokeWidth={2} className="text-primary shrink-0" />
              <span className="truncate max-w-[160px]" title={displayName}>
                {displayName}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
