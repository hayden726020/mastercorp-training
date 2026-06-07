"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoomType } from "@/types";

interface RoomTypeCardProps {
  room: RoomType;
  className?: string;
}

export default function RoomTypeCard({ room, className }: RoomTypeCardProps) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-card",
        // Card shadow with hover lift
        "shadow-card hover:shadow-card-hover",
        // Smooth transitions
        "transition-all duration-300 ease-out-expo",
        "hover:-translate-y-1",
        // Focus ring for keyboard
        "focus-visible:outline-2 focus-visible:outline-primary",
        className
      )}
    >
      {/* Aspect ratio container — 4:3 on mobile, 5:4 on desktop */}
      <div className="relative aspect-[4/3] md:aspect-[5/4] w-full">
        {/* Cover image */}
        <img
          src={room.coverImage}
          alt={`${room.name} — ${room.description}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay — deeper at bottom for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5"
          aria-hidden="true"
        />

        {/* Text overlay — positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          {/* Room name */}
          <h3 className="text-white text-lg md:text-xl font-semibold tracking-tight">
            {room.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-white/75 text-sm md:text-base leading-relaxed line-clamp-2">
            {room.description}
          </p>

          {/* CTA row */}
          <div className="mt-3 flex items-center gap-1.5 text-white/90 text-sm font-medium">
            <span>View Standards</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
