"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

interface AreaBreadcrumbProps {
  roomName: string;
  roomNameZh?: string;
  roomSlug: string;
  areaName: string;
  areaNameZh?: string;
  className?: string;
}

export default function AreaBreadcrumb({
  roomName,
  roomNameZh,
  roomSlug,
  areaName,
  areaNameZh,
  className,
}: AreaBreadcrumbProps) {
  const roomLabel = roomNameZh ? `${roomNameZh} · ${roomName}` : roomName;
  const areaLabel = areaNameZh ? `${areaNameZh} · ${areaName}` : areaName;

  return (
    <nav aria-label={t("nav.breadcrumb")} className={cn("flex items-center gap-1.5 text-sm flex-wrap", className)}>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors duration-150 shrink-0"
      >
        {t("nav.home")}
      </Link>
      <ChevronRight size={14} className="text-muted-foreground/40 shrink-0" aria-hidden="true" />
      <Link
        href={`/rooms/${roomSlug}`}
        className="text-muted-foreground hover:text-foreground transition-colors duration-150 truncate min-w-0 max-w-[120px] sm:max-w-[200px]"
        title={roomLabel}
      >
        {roomLabel}
      </Link>
      <ChevronRight size={14} className="text-muted-foreground/40 shrink-0" aria-hidden="true" />
      <span className="text-foreground font-medium truncate min-w-0 max-w-[100px] sm:max-w-[180px]" aria-current="page" title={areaLabel}>
        {areaLabel}
      </span>
    </nav>
  );
}
