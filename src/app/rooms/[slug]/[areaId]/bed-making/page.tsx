import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getRoomBySlug, getAreasByRoom } from "@/data";
import { BED_AREA_IDS } from "@/lib/bed-making-data";
import BedMakingSteps from "@/components/room/bed-making-steps";

// ── Props ──

interface BedMakingPageProps {
  params: { slug: string; areaId: string };
}

// ── Static params: only generate for bed areas ──

export async function generateStaticParams() {
  const areas = (await import("@/data/areas.json")).default;
  return areas
    .filter((area) => BED_AREA_IDS.has(area.id))
    .map((area) => ({
      slug: area.roomSlug,
      areaId: area.id,
    }));
}

// ── Metadata ──

export function generateMetadata({ params }: BedMakingPageProps): Metadata {
  const room = getRoomBySlug(params.slug);
  if (!room) return { title: "Page not found" };

  const areas = getAreasByRoom(room.id);
  const area = areas.find((a) => a.id === params.areaId);
  if (!area || !BED_AREA_IDS.has(area.id)) return { title: "Page not found" };

  const areaTitle = area.nameZh ?? area.name;
  const roomTitle = room.name;

  return {
    title: `铺床流程 · Bed-Making — ${areaTitle} — ${roomTitle}`,
    description: "8-step bed-making process with bilingual Chinese-English instructions",
  };
}

// ── Page ──

export default function BedMakingPage({ params }: BedMakingPageProps) {
  const room = getRoomBySlug(params.slug);
  if (!room) notFound();

  const areas = getAreasByRoom(room.id);
  const area = areas.find((a) => a.id === params.areaId);
  if (!area || !BED_AREA_IDS.has(area.id)) notFound();

  const areaName = area.nameZh ?? area.name;
  const roomName = room.name;

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Link
            href={`/rooms/${room.slug}/${area.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>
              返回 {areaName} · Back to {areaName}
            </span>
          </Link>
        </nav>

        {/* Page title */}
        <div>
          <h1 className="text-section-title font-bold text-primary tracking-tight">
            铺床流程（8步）
          </h1>
          <p className="mt-1.5 text-body text-muted-foreground">
            Bed-Making Process (8 Steps) — {roomName} {areaName}
          </p>
        </div>

        {/* Gold divider */}
        <hr className="border-accent/30" aria-hidden="true" />

        {/* Bed-making steps */}
        <BedMakingSteps />
      </div>
    </div>
  );
}
