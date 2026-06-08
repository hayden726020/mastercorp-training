"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RoomPanoramaProps {
  /** Panorama image URL */
  src: string;
  /** Alt text for the panorama image */
  alt: string;
  /** Hotspot overlay component or other children */
  children?: ReactNode;
  /** Optional class for the outer container */
  className?: string;
}

/**
 * Design reference dimensions for hotspot coordinates.
 *
 * All hotspot x/y values in areas.json are percentages of the original image's
 * pixel dimensions. The container's aspect-ratio is locked to the image's
 * natural aspect ratio so these percentages always map 1:1 to the visible
 * image — no bounds calculation, no cropping math, no responsive breakpoints.
 */
interface DesignReference {
  width: number;
  height: number;
}

export default function RoomPanorama({
  src,
  alt,
  children,
  className,
}: RoomPanoramaProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [designRef, setDesignRef] = useState<DesignReference | null>(null);

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    // Lock container aspect ratio to the original image's native dimensions.
    // This is the single-source-of-truth design reference for all hotspot
    // coordinates — one coordinate system, every screen, portrait or landscape.
    setDesignRef({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  }, []);

  // Handle browser-cached images (onLoad won't fire if already loaded)
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      handleImageLoad();
    }
  }, [handleImageLoad, src]);

  // Fallback aspect ratio shown while the image loads.
  // Replaced by the image's true AR as soon as naturalDimensions are known.
  const aspectRatio = designRef
    ? `${designRef.width} / ${designRef.height}`
    : "4 / 3";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-card bg-muted shadow-card",
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Panorama image — object-contain preserves the full image.
          Since the container's aspect-ratio matches the image, the image
          fills the container exactly with no letterboxing or cropping. */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
        onLoad={handleImageLoad}
      />

      {/* Light gradient vignette for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Hotspot overlay — absolute inset-0 fills the container which exactly
          matches the image. Percentage coordinates (x%, y%) from areas.json
          map 1:1 to the visible image on every screen. */}
      {designRef && (
        <div className="absolute inset-0" data-hotspot-container>
          {children}
        </div>
      )}
    </div>
  );
}
