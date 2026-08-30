"use client";

import dynamic from "next/dynamic";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

const StarfieldScene = dynamic(
  () => import("@/components/three/starfield-scene"),
  { ssr: false },
);

// Fixed behind every page. The body's radial gradient covers the same
// space whenever the animated scene is skipped.
export function SiteBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (reducedMotion || isSmallScreen) return null;

  return (
    <div
      aria-hidden
      style={{ viewTransitionName: "site-bg" }}
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <StarfieldScene />
    </div>
  );
}
