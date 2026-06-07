import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRoomBySlug, getAreasByRoom } from "@/data";
import RoomOverview from "@/components/room/room-overview";
import type { Metadata } from "next";

interface RoomPageProps {
  params: { slug: string };
}

// Generate static paths for all rooms
export async function generateStaticParams() {
  const rooms = (await import("@/data/rooms.json")).default;
  return rooms.map((room) => ({ slug: room.slug }));
}

// Dynamic metadata per room
export function generateMetadata({ params }: RoomPageProps): Metadata {
  const room = getRoomBySlug(params.slug);
  if (!room) return { title: "Room not found" };
  return {
    title: room.name,
    description: room.description,
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const room = getRoomBySlug(params.slug);

  if (!room) {
    notFound();
  }

  const areas = getAreasByRoom(room.id);
  const displayName = room.name;
  const displayDesc = room.description;

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </nav>

        {/* Room title */}
        <div>
          <h1 className="text-section-title font-bold text-primary tracking-tight">
            {displayName}
          </h1>
          <p className="mt-1.5 text-body text-muted-foreground max-w-2xl">
            {displayDesc}
          </p>
        </div>

        {/* Panorama + Hotspots + Quick Links */}
        <RoomOverview room={room} areas={areas} />

        {/* Area count badge */}
        {areas.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
                        {areas.length} areas with placement standards
          </p>
        )}
      </div>
    </div>
  );
}
