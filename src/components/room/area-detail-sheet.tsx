"use client";

import { ImageIcon, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { RoomArea, AreaContent, AreaImage } from "@/types";
import { iconMap } from "./hotspot-marker";
import StepSummary from "./step-summary";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TYPE_CONFIG } from "@/lib/image-type-config";
import { ROUTES } from "@/lib/constants";
import { t } from "@/lib/locales/zh";

// ── Single image card ──

function ImageCard({ image }: { image: AreaImage }) {
  const config = TYPE_CONFIG[image.imageType];
  const BadgeIcon = config.icon;

  return (
    <figure
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-smooth border-2 bg-card",
        config.border
      )}
      role="group"
      aria-label={`${config.labelZh}：${image.altTextZh ?? image.altText}`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
        <Image
          src={image.imageUrl}
          alt={image.altTextZh ?? image.altText}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          unoptimized
        />

        {/* Type badge — top-left */}
        <span
          className={cn(
            "absolute top-2 left-2 inline-flex items-center gap-1",
            "px-2 py-0.5 rounded-button text-xs font-semibold",
            "shadow-sm backdrop-blur-sm",
            config.badge
          )}
          aria-hidden="true"
        >
          <BadgeIcon size={12} strokeWidth={3} />
          {config.labelZh}
        </span>
      </div>

      {/* Caption */}
      <figcaption className="px-3 py-2 text-xs text-muted-foreground leading-relaxed">
        {image.altTextZh ?? image.altText}
      </figcaption>
    </figure>
  );
}

// ── Image gallery ──

function ImageGallery({ images }: { images: AreaImage[] }) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
          <ImageIcon size={18} className="text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("content.preparing_images")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {images
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
    </div>
  );
}

// ── Main sheet component ──

interface AreaDetailSheetProps {
  area: RoomArea;
  content: AreaContent | null;
  roomSlug: string;
}

export default function AreaDetailSheet({
  area,
  content,
  roomSlug,
}: AreaDetailSheetProps) {
  const Icon = iconMap[area.iconType] ?? MapPin;

  return (
    <div className="flex flex-col">
      {/* ── Header: icon + name + description ── */}
      <DialogHeader>
        <div className="flex justify-center sm:justify-start">
          <span
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              "bg-primary/10 text-primary"
            )}
            aria-hidden="true"
          >
            <Icon size={22} strokeWidth={2} />
          </span>
        </div>
        <DialogTitle>
          {area.nameZh ? `${area.nameZh} · ${area.name}` : area.name}
        </DialogTitle>
        <DialogDescription>
          {content?.descriptionZh ?? content?.description ?? area.descriptionZh ?? area.description}
        </DialogDescription>
      </DialogHeader>

      {/* ── Body: image gallery + step summary ── */}
      <div className="px-6 pb-2">
        {/* Gold divider */}
        <hr className="border-accent/30 mb-4" aria-hidden="true" />

        <div className="flex flex-col md:flex-row gap-5">
          {/* ── Left: image gallery ── */}
          <div className="flex-1 min-w-0">
            {content ? (
              <ImageGallery images={content.images} />
            ) : (
              /* Empty state — no content at all */
              <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
                  <ImageIcon size={18} className="text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("content.preparing_content")}
                </p>
              </div>
            )}
          </div>

          {/* ── Right: 7-step cleaning process ── */}
          {/* Mobile: subtle top-border separator */}
          <div className="md:hidden">
            <hr className="border-border/40 mb-3" aria-hidden="true" />
          </div>
          <div className="md:w-[228px] md:shrink-0">
            <StepSummary />
          </div>
        </div>
      </div>

      {/* "View Full Details" link */}
      <div className="px-6 pt-1 pb-0">
        <hr className="border-border/40 mb-3" aria-hidden="true" />
        <Link
          href={ROUTES.AREA_DETAIL(roomSlug, area.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
        >
          {t("area.view_full_details")}
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {/* Bottom breathing room */}
      <div className="shrink-0 h-4" />
    </div>
  );
}
