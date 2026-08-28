"use client";

import dynamic from "next/dynamic";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

const HeroScene = dynamic(() => import("@/components/three/hero-object"), {
  ssr: false,
});

// Fixed behind the whole site. The body's radial gradient covers the same
// space whenever the animated scene is skipped, so content never depends
// on this rendering.
export function SiteBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (reducedMotion || isSmallScreen) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <HeroScene />
    </div>
  );
}
