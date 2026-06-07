/**
 * Custom SVG icons not available in lucide-react.
 * All icons follow lucide conventions: viewBox 0 0 24 24, stroke currentColor.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function createIcon(d: string, label: string) {
  function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label={label}
        {...props}
      >
        <path d={d} />
      </svg>
    );
  }
  Icon.displayName = label;
  return Icon;
}

/** Toilet / WC icon — tank + bowl */
export const ToiletIcon = createIcon(
  [
    // Tank
    "M7 3 h10 a2 2 0 0 1 2 2 v3 H5 V5 a2 2 0 0 1 2-2 z",
    // Bowl
    "M5 8 v5 a7 5 0 0 0 14 0 V8",
    // Seat / lid outline
    "M6 9 a6 3.5 0 0 0 12 0",
  ].join(" "),
  "Toilet · 马桶"
);

/** Sink / washbasin icon — basin + faucet */
export const WashbasinIcon = createIcon(
  [
    // Basin bowl
    "M4 9 a2 2 0 0 1 2-2 h12 a2 2 0 0 1 2 2 v5 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V9 z",
    // Faucet neck
    "M12 4 v3",
    // Faucet spout horizontal
    "M10 4 h4",
    // Faucet curve
    "M14 4 c1.5 0 2.5 1 2.5 2.5",
    // Drain
    "M9 12 h6",
  ].join(" "),
  "Washbasin · 洗手盆"
);
