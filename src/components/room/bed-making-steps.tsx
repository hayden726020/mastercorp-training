"use client";

import { BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import { BED_MAKING_STEPS } from "@/lib/bed-making-data";

interface BedMakingStepsProps {
  className?: string;
}

export default function BedMakingSteps({ className }: BedMakingStepsProps) {
  return (
    <section
      className={cn("flex flex-col gap-4", className)}
      aria-label="铺床流程 · Bed-Making Process"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0">
          <BedDouble size={15} strokeWidth={2.5} />
        </span>
        <span className="text-sm font-bold text-primary tracking-wide">
          铺床流程（8步）· Bed-Making Process (8 Steps)
        </span>
      </div>

      {/* Step cards */}
      <ol className="space-y-3">
        {BED_MAKING_STEPS.map((s) => (
          <li
            key={s.step}
            className={cn(
              "grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-3 md:gap-4",
              "p-4 rounded-card border-2 border-border/60",
              "bg-card hover:border-primary/20 transition-colors duration-200"
            )}
          >
            {/* Step number badge */}
            <div className="flex items-start md:items-center">
              <span
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                  "bg-primary text-primary-foreground",
                  "text-xs font-bold"
                )}
                aria-hidden="true"
              >
                {s.step}
              </span>
            </div>

            {/* Chinese column */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-foreground">
                {s.zh}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {s.zhDetail}
              </span>
            </div>

            {/* English column */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-primary/80">
                {s.en}
              </span>
              <span className="text-sm text-muted-foreground/80 leading-relaxed">
                {s.enDetail}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
