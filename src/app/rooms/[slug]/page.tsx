import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRoomBySlug, getAreasByRoom } from "@/data";
import { t } from "@/lib/locales/zh";
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
  if (!room) return { title: t("room.not_found") };
  const title = room.nameZh
    ? `${room.nameZh} · ${room.name}`
    : room.name;
  return {
    title,
    description: room.descriptionZh ?? room.description,
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const room = getRoomBySlug(params.slug);

  if (!room) {
    notFound();
  }

  const areas = getAreasByRoom(room.id);
  const displayName = room.nameZh ? `${room.nameZh} · ${room.name}` : room.name;
  const displayDesc = room.descriptionZh ?? room.description;

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label={t("nav.breadcrumb")}>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{t("nav.back_to_home")}</span>
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
            {t("room.area_count", { count: areas.length })}
          </p>
        )}
      </div>
    </div>
  );
}
