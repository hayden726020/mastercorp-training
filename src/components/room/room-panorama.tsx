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

interface ImageBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Calculate the actual rendered bounds of an image under `object-fit: cover`.
 *
 * When the container aspect ratio differs from the image's natural aspect ratio,
 * `object-cover` scales the image to fill the container and crops the overflow.
 * Hotspots defined as percentages of the image must be positioned relative to
 * these rendered bounds — not the full container — so they stay aligned on all
 * screen sizes (including mobile where the aspect ratio changes).
 */
function calcObjectCoverBounds(
  containerW: number,
  containerH: number,
  imgNaturalW: number,
  imgNaturalH: number
): ImageBounds {
  if (!containerW || !containerH || !imgNaturalW || !imgNaturalH) {
    return { left: 0, top: 0, width: containerW, height: containerH };
  }

  const containerAR = containerW / containerH;
  const imgAR = imgNaturalW / imgNaturalH;

  if (containerAR > imgAR) {
    // Container is wider than the image → image scaled to match height,
    // cropped horizontally on left/right.
    const renderedW = containerH * imgAR;
    const renderedH = containerH;
    const left = (containerW - renderedW) / 2;
    return { left, top: 0, width: renderedW, height: renderedH };
  }

  // Container is taller (or equal) → image scaled to match width,
  // cropped vertically on top/bottom.
  const renderedW = containerW;
  const renderedH = containerW / imgAR;
  const top = (containerH - renderedH) / 2;
  return { left: 0, top, width: renderedW, height: renderedH };
}

export default function RoomPanorama({
  src,
  alt,
  children,
  className,
}: RoomPanoramaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);

  const recalcBounds = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const bounds = calcObjectCoverBounds(
      container.clientWidth,
      container.clientHeight,
      img.naturalWidth,
      img.naturalHeight
    );
    setImageBounds(bounds);
  }, []);

  // Recalculate when the image loads (natural dimensions become available)
  const handleImageLoad = useCallback(() => {
    recalcBounds();
  }, [recalcBounds]);

  // Recalculate on container resize (orientation change, window resize)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial calculation — image may already be loaded (cached)
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      recalcBounds();
    }

    const observer = new ResizeObserver(() => {
      recalcBounds();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [recalcBounds, src]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-card",
        // 4:3 aspect ratio on mobile, 16:9 on desktop
        "aspect-[4/3] md:aspect-[16/9]",
        "bg-muted shadow-card",
        className
      )}
    >
      {/* Panorama image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        onLoad={handleImageLoad}
      />

      {/* Light gradient vignette for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Hotspot overlay — positioned to match the image's actual rendered area
          under object-cover, so percentage-based hotspot coordinates stay aligned
          across all screen sizes */}
      {imageBounds && (
        <div
          className="absolute"
          style={{
            left: imageBounds.left,
            top: imageBounds.top,
            width: imageBounds.width,
            height: imageBounds.height,
          }}
          data-hotspot-container
        >
          {children}
        </div>
      )}
    </div>
  );
}
