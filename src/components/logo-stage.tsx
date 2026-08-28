"use client";

import dynamic from "next/dynamic";

const HeroObject = dynamic(() => import("@/components/three/hero-object"), {
  ssr: false,
});

// Isolated view for tuning the 3D mark. Dark gradient ground + the object
// + a CAD-style annotation overlay.
export function LogoStage() {
  return (
    <div className="fixed inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#0b1330_0%,#060810_60%)]">
      <HeroObject />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-white/25"
        aria-hidden
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
        >
          <line x1="50%" y1="50%" x2="72%" y2="30%" />
          <line x1="50%" y1="50%" x2="30%" y2="64%" />
          <line x1="50%" y1="50%" x2="66%" y2="70%" />
        </g>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <rect x="71%" y="27%" width="26" height="26" />
          <rect x="28%" y="62%" width="20" height="20" />
          <rect x="65%" y="68%" width="20" height="20" />
        </g>
        <g
          className="text-white/40"
          fill="currentColor"
          fontSize="10"
          fontFamily="var(--font-geist-mono), monospace"
        >
          <text x="calc(71% + 34px)" y="calc(27% + 16px)">
            MARK.V
          </text>
          <text x="calc(28% - 44px)" y="calc(62% + 14px)">
            AXIS.Y
          </text>
        </g>
      </svg>
    </div>
  );
}
