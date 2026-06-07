"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { AreaImage } from "@/types";
import { TYPE_CONFIG } from "@/lib/image-type-config";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

// ── Props ──

interface ImageViewerProps {
  images: AreaImage[];
  initialIndex: number;
  onClose: () => void;
  areaName: string;
}

// ── Constants ──

const SWIPE_THRESHOLD = 50;

// ── Component ──

export default function ImageViewer({
  images,
  initialIndex,
  onClose,
  areaName,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [swipeX, setSwipeX] = useState(0);

  // Drag refs
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    lastX: 0,
  });

  // Double-tap ref
  const lastTapRef = useRef(0);

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentImage = sortedImages[currentIndex];
  const imageCount = sortedImages.length;
  const hasMultiple = imageCount > 1;

  // ── Mount animation ──
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // ── Body scroll lock ──
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ── Keyboard ──
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        setCurrentIndex((i) => (i > 0 ? i - 1 : imageCount - 1));
      } else if (e.key === "ArrowRight" && hasMultiple) {
        setCurrentIndex((i) => (i < imageCount - 1 ? i + 1 : 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasMultiple, imageCount]);

  // Reset zoom + swipe on index change
  useEffect(() => {
    setScale(1);
    setSwipeX(0);
  }, [currentIndex]);

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
    dragRef.current = { isDragging: true, startX: e.clientX, lastX: e.clientX };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging || !hasMultiple) return;
    e.preventDefault();
    dragRef.current.lastX = e.clientX;
    const dx = e.clientX - dragRef.current.startX;
    // Clamp swipe to reasonable range
    setSwipeX(Math.max(-200, Math.min(200, dx)));
  }, [hasMultiple]);

  const handlePointerUp = useCallback(
    () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;

      const dx = dragRef.current.lastX - dragRef.current.startX;
      setSwipeX(0);

      if (Math.abs(dx) > SWIPE_THRESHOLD && hasMultiple) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev, hasMultiple]
  );

  // ── Double-tap zoom ──
  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't zoom if we just swiped
      if (dragRef.current.isDragging) return;

      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap — toggle zoom
        e.preventDefault();
        setScale((s) => (s > 1 ? 1 : 2.5));
      }
      lastTapRef.current = now;
    },
    []
  );

  // ── Close on backdrop click ──
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // ── Guard ──
  if (!currentImage) {
    return null;
  }

  const config = TYPE_CONFIG[currentImage.imageType];
  const BadgeIcon = config.icon;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-black/95",
        mounted ? "visible" : "invisible"
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={t("viewer.label", { name: areaName })}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10 flex items-center justify-center",
          "w-11 h-11 rounded-full",
          "bg-white/10 hover:bg-white/20 text-white",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        )}
        aria-label={t("viewer.close")}
      >
        <X size={20} strokeWidth={2} />
      </button>

      {/* Image counter — aligned with close button (both h-11, top-4) */}
      {hasMultiple && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 h-11 flex items-center text-sm text-white/70 font-medium tabular-nums">
          {currentIndex + 1} / {imageCount}
        </span>
      )}

      {/* Prev arrow */}
      {hasMultiple && (
        <button
          type="button"
          onClick={goPrev}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center w-11 h-11 rounded-full",
            "bg-white/10 hover:bg-white/20 text-white",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          )}
          aria-label={t("viewer.previous")}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
      )}

      {/* Next arrow */}
      {hasMultiple && (
        <button
          type="button"
          onClick={goNext}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center w-11 h-11 rounded-full",
            "bg-white/10 hover:bg-white/20 text-white",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          )}
          aria-label={t("viewer.next")}
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      )}

      {/* Image */}
      <div
        className={cn(
          "relative flex items-center justify-center",
          "w-full h-full p-8 md:p-16",
          mounted ? "scale-100" : "scale-95",
          "transition-transform duration-300 ease-out"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="relative max-w-full max-h-full select-none">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.altTextZh ?? currentImage.altText}
            width={1200}
            height={900}
            className={cn(
              "max-w-full max-h-[85vh] object-contain",
              "transition-transform duration-200 ease-out"
            )}
            style={{
              transform: `scale(${scale}) translateX(${swipeX}px)`,
              cursor: scale > 1 ? "zoom-out" : "zoom-in",
            }}
            unoptimized
            onClick={handleImageClick}
            draggable={false}
          />

          {/* Image type badge */}
          <span
            className={cn(
              "absolute bottom-2 left-2 inline-flex items-center gap-1",
              "px-2 py-0.5 rounded-button text-xs font-semibold",
              "shadow-sm",
              config.badge
            )}
            aria-hidden="true"
          >
            <BadgeIcon size={12} strokeWidth={3} />
            {config.labelZh}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
