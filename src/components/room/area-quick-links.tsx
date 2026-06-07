"use client";

import { Bed, Bath, Coffee, Tv, DoorOpen, Monitor, CookingPot, MapPin } from "lucide-react";
import { ToiletIcon, WashbasinIcon } from "./custom-icons";
import { cn } from "@/lib/utils";
import type { RoomArea } from "@/types";
import { t } from "@/lib/locales/zh";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIcon = React.ComponentType<any>;

const iconMap: Record<string, AnyIcon> = {
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

interface AreaQuickLinksProps {
  areas: RoomArea[];
  onAreaClick?: (area: RoomArea) => void;
  className?: string;
}

export default function AreaQuickLinks({
  areas,
  onAreaClick,
  className,
}: AreaQuickLinksProps) {
  const handleClick = (area: RoomArea) => {
    onAreaClick?.(area);
  };

  if (areas.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-auto",
        // Hide scrollbar on WebKit
        "[&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="flex gap-2 px-1 py-1 min-w-max">
        {areas.map((area) => {
          const Icon = iconMap[area.iconType] ?? MapPin;
          const displayName = area.nameZh ? `${area.nameZh} · ${area.name}` : area.name;
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => handleClick(area)}
              className={cn(
                "flex items-center gap-2 shrink-0",
                "px-3 py-2.5 rounded-button min-h-[44px]",
                "bg-card border text-foreground",
                "shadow-card hover:shadow-card-hover",
                "transition-all duration-200 ease-out-expo",
                "active:scale-95",
                "hover:-translate-y-0.5 hover:border-primary/30",
                "focus-visible:outline-2 focus-visible:outline-primary",
                "touch-manipulation"
              )}
              aria-label={t("hotspot.go_to_area", { name: displayName })}
            >
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/[0.08] text-primary"
                aria-hidden="true"
              >
                <Icon size={12} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-medium whitespace-nowrap">
                {displayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
