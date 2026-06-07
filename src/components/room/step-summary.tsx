"use client";

import { ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

// ── 7-Step Cleaning Process Data ──

interface StepData {
  step: number;
  en: string;
  es: string;
  ht: string;
  zh: string;
}

export const CLEANING_STEPS: StepData[] = [
  { step: 1, en: "PREP", es: "Preparación", ht: "Preparasyon Inite", zh: "准备工作" },
  { step: 2, en: "KITCHEN", es: "Cocina", ht: "Kwizin", zh: "厨房打扫" },
  { step: 3, en: "BATHROOMS", es: "Baños", ht: "Saldeben", zh: "卫浴清洁" },
  { step: 4, en: "DUST", es: "Limpiar Polvo", ht: "Retire Pousyè", zh: "除尘" },
  { step: 5, en: "BEDS", es: "Camas", ht: "Kabann", zh: "铺床" },
  { step: 6, en: "FLOORS", es: "Pisos", ht: "Pakè", zh: "地面清扫" },
  { step: 7, en: "PRESENT", es: "Presentar", ht: "Prezante", zh: "完工验收" },
];

// ── Component ──

interface StepSummaryProps {
  /** When true, the cleaning-process header is shown in bilingual format (for hotspot modal).
   *  When false / omitted, it's shown in Chinese only (for standalone page). */
  bilingual?: boolean;
  className?: string;
}

export default function StepSummary({ bilingual = false, className }: StepSummaryProps) {
  const headerText = bilingual
    ? t("step_summary.bilingual_header")
    : t("area.cleaning_process");

  return (
    <aside
      className={cn("flex flex-col gap-0.5", className)}
      aria-label={t("steps.aria_label")}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-1.5 px-1">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent shrink-0">
          <ListOrdered size={13} strokeWidth={2.5} />
        </span>
        <span className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">
          {headerText}
        </span>
      </div>

      {/* Step list */}
      <ol className="space-y-0.5">
        {CLEANING_STEPS.map((s) => (
          <li
            key={s.step}
            className={cn(
              "group flex items-start gap-2 px-2 py-1.5 rounded-smooth",
              "transition-colors duration-150",
              "hover:bg-muted/60"
            )}
          >
            {/* Step number */}
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-px",
                "bg-primary text-primary-foreground",
                "text-[10px] font-bold leading-none"
              )}
              aria-hidden="true"
            >
              {s.step}
            </span>

            {/* Labels */}
            <div className="flex flex-col min-w-0">
              {/* Chinese — primary */}
              <span className="text-xs font-semibold text-foreground leading-tight tracking-wide">
                {s.zh}
              </span>
              {/* English — secondary */}
              <span className="text-[11px] text-muted-foreground leading-tight">
                {s.en}
              </span>
              {/* Spanish — secondary */}
              <span className="text-[11px] text-muted-foreground/70 leading-tight italic">
                {s.es}
              </span>
              {/* Haitian Creole — tertiary */}
              <span className="text-[10px] text-muted-foreground/50 leading-tight italic">
                {s.ht}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
