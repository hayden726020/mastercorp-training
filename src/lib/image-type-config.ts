import { Check, X, ZoomIn } from "lucide-react";
import { ImageType } from "@/types";

/** Visual config for each image type (STANDARD / WRONG / DETAIL) */
export const TYPE_CONFIG: Record<
  ImageType,
  { icon: typeof Check; label: string; labelZh: string; border: string; badge: string }
> = {
  [ImageType.STANDARD]: {
    icon: Check,
    label: "Correct",
    labelZh: "正确 · Correct",
    border: "border-emerald-400",
    badge: "bg-emerald-50 text-emerald-700",
  },
  [ImageType.WRONG]: {
    icon: X,
    label: "Wrong",
    labelZh: "错误 · Wrong",
    border: "border-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  [ImageType.DETAIL]: {
    icon: ZoomIn,
    label: "Detail",
    labelZh: "细节 · Detail",
    border: "border-primary",
    badge: "bg-primary/10 text-primary",
  },
};
