import { useId } from "react";
import { V_PATH } from "@/components/glass-v";

// The logo V as vector (same path as app/icon.svg), so it sits cleanly on
// the texture with no badge behind it and stays sharp at any size.
export function BrandMark({ size = 32 }: { size?: number }) {
  // Header and footer both render a mark; each needs its own gradient id.
  const id = `brand-mark-${useId()}`;
  return (
    <svg
      width={size}
      height={Math.round((size * 23.5) / 26)}
      viewBox="3 4.5 26 23.5"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={id}
          x1="16"
          y1="4.5"
          x2="16"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9CE3FF" />
          <stop offset="1" stopColor="#0287DE" />
        </linearGradient>
      </defs>
      <path d={V_PATH} fill={`url(#${id})`} />
    </svg>
  );
}
