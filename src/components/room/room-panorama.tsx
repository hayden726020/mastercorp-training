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
 * Calculate where an image actually renders inside a container when using
 * `object-fit: contain`.
 *
 * `object-contain` scales the image to fit entirely within the container while
 * preserving its natural aspect ratio. If the container's aspect ratio differs
 * from the image's, the image is letterboxed (top/bottom bars) or pillarboxed
 * (left/right bars) and centered.
 *
 * Hotspots defined as percentages of the original image must be placed inside
 * a layer that matches these rendered bounds — otherwise percentage coordinates
 * are relative to the full container and don't align with the scaled image.
 */
function calcObjectContainBounds(
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
    // Container is wider than the image.
    // Image scaled to match container height → pillarboxed on left/right.
    const renderedW = containerH * imgAR;
    const renderedH = containerH;
    const left = (containerW - renderedW) / 2;
    return { left, top: 0, width: renderedW, height: renderedH };
  }

  // Container is taller than (or equal to) the image.
  // Image scaled to match container width → letterboxed on top/bottom.
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

    const bounds = calcObjectContainBounds(
      container.clientWidth,
      container.clientHeight,
      img.naturalWidth,
      img.naturalHeight
    );
    setImageBounds(bounds);
  }, []);

  const handleImageLoad = useCallback(() => {
    recalcBounds();
  }, [recalcBounds]);

  // Recalculate on container resize (orientation change, window resize)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If image is already loaded (browser cache), calculate immediately
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
        // 4:3 on mobile, 16:9 on desktop
        "aspect-[4/3] md:aspect-[16/9]",
        "bg-muted shadow-card",
        className
      )}
    >
      {/* Panorama image — object-contain so the full image is always visible
          and percentage-based hotspot positions map 1:1 to the image */}
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

      {/* Hotspot overlay — matches the image's actual rendered bounds under
          object-contain. This is the SAME parent as the image, so percentage
          coordinates are consistent across all screen sizes. */}
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
