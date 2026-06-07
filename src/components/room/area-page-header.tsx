"use client";

import { MapPin } from "lucide-react";
import { iconMap } from "./hotspot-marker";
import { cn } from "@/lib/utils";

interface AreaPageHeaderProps {
  iconType: string;
  name: string;
  nameZh?: string;
  description: string;
  descriptionZh?: string;
}

export default function AreaPageHeader({
  iconType,
  name,
  nameZh,
  description,
  descriptionZh,
}: AreaPageHeaderProps) {
  const Icon = iconMap[iconType] ?? MapPin;

  const displayName = nameZh ? `${nameZh} · ${name}` : name;
  const displayDesc = descriptionZh ?? description;

  return (
    <header className="flex flex-col items-center sm:items-start gap-2">
      <span
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full",
          "bg-primary/10 text-primary"
        )}
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={2} />
      </span>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {displayName}
      </h1>
      <p className="text-sm text-muted-foreground max-w-prose">
        {displayDesc}
      </p>
    </header>
  );
}
