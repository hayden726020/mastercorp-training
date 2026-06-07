import { notFound } from "next/navigation";
import Link from "next/link";
import { BedDouble } from "lucide-react";
import type { Metadata } from "next";
import { getRoomBySlug, getAreasByRoom, getContentByArea } from "@/data";
import { t } from "@/lib/locales/zh";
import { BED_AREA_IDS } from "@/lib/bed-making-data";
import AreaPageHeader from "@/components/room/area-page-header";
import AreaBreadcrumb from "@/components/room/area-breadcrumb";
import ImageGallery from "@/components/image/image-gallery";
import StepSummary from "@/components/room/step-summary";
import RelatedAreasLinks from "@/components/room/related-areas-links";
import { cn } from "@/lib/utils";

// ── Props ──

interface AreaDetailPageProps {
  params: { slug: string; areaId: string };
}

// ── Static params ──

export async function generateStaticParams() {
  const areas = (await import("@/data/areas.json")).default;
  return areas.map((area) => ({
    slug: area.roomSlug,
    areaId: area.id,
  }));
}

// ── Metadata ──

export function generateMetadata({
  params,
}: AreaDetailPageProps): Metadata {
  const room = getRoomBySlug(params.slug);
  if (!room) return { title: t("room.not_found") };

  const areas = getAreasByRoom(room.id);
  const area = areas.find((a) => a.id === params.areaId);
  if (!area) return { title: t("area.not_found") };

  const areaTitle = area.nameZh ?? area.name;
  const roomTitle = room.nameZh ?? room.name;

  return {
    title: `${areaTitle} — ${roomTitle}`,
    description: area.descriptionZh ?? area.description,
  };
}

// ── Page ──

export default function AreaDetailPage({ params }: AreaDetailPageProps) {
  // Look up room
  const room = getRoomBySlug(params.slug);
  if (!room) notFound();

  // Look up area
  const areas = getAreasByRoom(room.id);
  const area = areas.find((a) => a.id === params.areaId);
  if (!area) notFound();

  // Look up content
  const content = getContentByArea(area.id);
  const images = content?.images ?? [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-6">
      {/* ── Breadcrumb ── */}
      <AreaBreadcrumb
        roomName={room.name}
        roomNameZh={room.nameZh}
        roomSlug={room.slug}
        areaName={area.name}
        areaNameZh={area.nameZh}
      />

      {/* ── Header ── */}
      <AreaPageHeader
        iconType={area.iconType}
        name={area.name}
        nameZh={area.nameZh}
        description={area.description}
        descriptionZh={area.descriptionZh}
      />

      {/* ── Gold divider ── */}
      <hr className="border-accent/30" aria-hidden="true" />

      {/* ── Main content: gallery + steps ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: gallery */}
        <div className="flex-1 min-w-0">
          <ImageGallery
            images={images}
            areaName={area.name}
            areaNameZh={area.nameZh}
          />
        </div>

        {/* Right: cleaning steps (all areas) + bed-making button (bed areas only) */}
        <div className="lg:w-[228px] lg:shrink-0 flex flex-col gap-3">
          {/* Mobile: collapsible via <details> */}
          <details className="lg:hidden group" open>
            <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-muted-foreground uppercase tracking-wide py-2 select-none">
              {t("area.cleaning_process")}
              <span className="text-[10px] text-muted-foreground/50 ml-auto group-open:hidden">
                {t("area.tap_to_expand")}
              </span>
            </summary>
            <div className="pt-1">
              <StepSummary />
            </div>
          </details>

          {/* Desktop: always visible */}
          <div className="hidden lg:block">
            <StepSummary />
          </div>

          {/* Bed areas: additional bed-making button */}
          {BED_AREA_IDS.has(area.id) && (
            <Link
              href={`/rooms/${room.slug}/${area.id}/bed-making`}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-button",
                "bg-primary text-primary-foreground",
                "text-xs font-semibold",
                "hover:bg-primary/90 transition-colors duration-150",
                "justify-center"
              )}
            >
              <BedDouble size={14} strokeWidth={2.5} />
              Bed-Making (8 Steps)
            </Link>
          )}
        </div>
      </div>

      {/* ── Related areas ── */}
      <RelatedAreasLinks
        areas={areas}
        currentAreaId={area.id}
        roomSlug={room.slug}
      />
    </div>
  );
}
