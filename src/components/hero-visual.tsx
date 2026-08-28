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
      <div className="absolute right-[-10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
    );
  }

  return <HeroObject />;
}
