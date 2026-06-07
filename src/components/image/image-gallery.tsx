"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import type { AreaImage } from "@/types";
import { TYPE_CONFIG } from "@/lib/image-type-config";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";
import ImageViewer from "./image-viewer";

// ── Props ──

interface ImageGalleryProps {
  images: AreaImage[];
  areaName: string;
  areaNameZh?: string;
}

// ── Constants ──

const SWIPE_THRESHOLD = 50;

// ── Component ──

export default function ImageGallery({ images, areaName, areaNameZh }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Drag refs
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    lastX: 0,
    hasMoved: false,
  });

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.sortOrder - b.sortOrder),
    [images]
  );

  const imageCount = sortedImages.length;
  const hasMultiple = imageCount > 1;
  const currentImage = sortedImages[currentIndex];

  const displayName = areaNameZh ? `${areaNameZh} · ${areaName}` : areaName;

  // ── Reset index when images change ──
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // ── Auto-scroll active thumbnail into view ──
  useEffect(() => {
    if (!thumbnailStripRef.current || !hasMultiple) return;
    const activeThumb = thumbnailStripRef.current.querySelector(
      `[data-thumb-index="${currentIndex}"]`
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex, hasMultiple]);

  // ── Keyboard ──
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!containerRef.current?.contains(document.activeElement)) return;
      if (!hasMultiple) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((i) => (i > 0 ? i - 1 : imageCount - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((i) => (i < imageCount - 1 ? i + 1 : 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultiple, imageCount]);

  // ── Navigation ──
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : imageCount - 1));
  }, [imageCount]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < imageCount - 1 ? i + 1 : 0));
  }, [imageCount]);

  // ── Swipe handlers ──
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      lastX: e.clientX,
      hasMoved: false,
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging || !hasMultiple) return;
    e.preventDefault();
    dragRef.current.lastX = e.clientX;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) {
      dragRef.current.hasMoved = true;
    }
    setSwipeX(Math.max(-150, Math.min(150, dx)));
  }, [hasMultiple]);

  const handlePointerUp = useCallback(
    () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;

      const dx = dragRef.current.lastX - dragRef.current.startX;
      setSwipeX(0);

      if (dragRef.current.hasMoved && Math.abs(dx) > SWIPE_THRESHOLD && hasMultiple) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev, hasMultiple]
  );

  // ── Empty state ──
  if (imageCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
          <ImageIcon size={22} className="text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("gallery.empty")}
        </p>
      </div>
    );
  }

  // ── Guard ──
  if (!currentImage) return null;

  const config = TYPE_CONFIG[currentImage.imageType];
  const BadgeIcon = config.icon;

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col gap-3"
        role="region"
        aria-label={t("gallery.label", { name: displayName })}
        tabIndex={0}
      >
        {/* ── Main image area ── */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-card bg-muted/20",
            "aspect-[4/3] md:aspect-[16/10]"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Click to open viewer */}
          <button
            type="button"
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setViewerOpen(true)}
            aria-label={t("gallery.open_viewer", { alt: currentImage.altTextZh ?? currentImage.altText })}
          >
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.altTextZh ?? currentImage.altText}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover transition-transform duration-200 ease-out"
              style={{ transform: `translateX(${swipeX}px)` }}
              unoptimized
              draggable={false}
            />
          </button>

          {/* Image type badge */}
          <span
            className={cn(
              "absolute top-3 left-3 inline-flex items-center gap-1",
              "px-2 py-0.5 rounded-button text-xs font-semibold",
              "shadow-sm backdrop-blur-sm",
              config.badge
            )}
            aria-hidden="true"
          >
            <BadgeIcon size={12} strokeWidth={3} />
            {config.labelZh}
          </span>

          {/* Image counter */}
          {hasMultiple && (
            <span
              className={cn(
                "absolute top-3 right-3",
                "px-2 py-0.5 rounded-button text-xs font-medium tabular-nums",
                "bg-black/50 text-white"
              )}
              aria-hidden="true"
            >
              {currentIndex + 1} / {imageCount}
            </span>
          )}

          {/* Prev arrow — 44px touch target */}
          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "flex items-center justify-center w-11 h-11 rounded-full",
                "bg-background/80 hover:bg-background text-foreground shadow-md",
                "active:scale-95",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label={t("gallery.previous")}
            >
              <ChevronLeft size={22} strokeWidth={2} />
            </button>
          )}

          {/* Next arrow — 44px touch target */}
          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "flex items-center justify-center w-11 h-11 rounded-full",
                "bg-background/80 hover:bg-background text-foreground shadow-md",
                "active:scale-95",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label={t("gallery.next")}
            >
              <ChevronRight size={22} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {hasMultiple && (
          <div
            ref={thumbnailStripRef}
            className={cn(
              "flex gap-2 overflow-x-auto pb-1",
              "[&::-webkit-scrollbar]:hidden",
              "[-ms-overflow-style:none]",
              "[scrollbar-width:none]"
            )}
            role="tablist"
            aria-label={t("gallery.thumbnails")}
          >
            {sortedImages.map((image, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={image.id}
                  type="button"
                  data-thumb-index={idx}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={t("gallery.image_n", { n: idx + 1, alt: image.altTextZh ?? image.altText })}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative shrink-0 w-16 h-12 overflow-hidden rounded-smooth",
                    "transition-all duration-150",
                    isActive
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                      : "ring-1 ring-border opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image.thumbnailUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Caption */}
        <p className="text-xs text-muted-foreground leading-relaxed px-1">
          {currentImage.altTextZh ?? currentImage.altText}
        </p>
      </div>

      {/* ── Fullscreen viewer ── */}
      {viewerOpen && (
        <ImageViewer
          images={sortedImages}
          initialIndex={currentIndex}
          onClose={() => setViewerOpen(false)}
          areaName={displayName}
        />
      )}
    </>
  );
}
