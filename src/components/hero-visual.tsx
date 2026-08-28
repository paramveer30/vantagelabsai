"use client";

import dynamic from "next/dynamic";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

const HeroObject = dynamic(() => import("@/components/three/hero-object"), {
  ssr: false,
});

export function HeroVisual() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (reducedMotion || isSmallScreen) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_45%,rgba(47,107,255,0.22),transparent_70%)]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <HeroObject />
    </div>
  );
}
