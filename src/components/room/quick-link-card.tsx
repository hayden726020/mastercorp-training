import Link from "next/link";
import { ArrowRight, ClipboardCheck, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

type QuickLinkVariant = "checklist" | "compare";

interface QuickLinkCardProps {
  variant: QuickLinkVariant;
  className?: string;
}

const config: Record<
  QuickLinkVariant,
  { icon: typeof ClipboardCheck; label: string; desc: string; href: string }
> = {
  checklist: {
    icon: ClipboardCheck,
    label: t("card.checklist"),
    desc: t("card.checklist_desc"),
    href: "/checklist",
  },
  compare: {
    icon: GitCompare,
    label: t("card.compare_rooms"),
    desc: t("card.compare_desc"),
    href: "/rooms/compare",
  },
};

export default function QuickLinkCard({
  variant,
  className,
}: QuickLinkCardProps) {
  const { icon: Icon, label, desc, href } = config[variant];

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 w-full rounded-card border bg-card px-5 py-4",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-300 ease-out-expo",
        "hover:-translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-primary",
        className
      )}
    >
      {/* Icon */}
      <div
        className="flex shrink-0 items-center justify-center w-10 h-10 rounded-button bg-primary/[0.08] text-primary transition-colors duration-300 group-hover:bg-primary/[0.14]"
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          {label}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="shrink-0 text-muted-foreground/50 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
