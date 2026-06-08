"use client";

import type { ReactNode } from "react";
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

export default function RoomPanorama({
  src,
  alt,
  children,
  className,
}: RoomPanoramaProps) {
  return (
    <div
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
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Light gradient vignette for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Hotspot overlay layer */}
      {children}
    </div>
  );
}
