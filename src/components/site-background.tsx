"use client";

import dynamic from "next/dynamic";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

const Beams = dynamic(() => import("@/components/three/beams"), { ssr: false });

export function SiteBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // The body's radial gradient stands in whenever the animated layer is
  // skipped, so nothing here is a hard dependency for the page to look right.
  if (reducedMotion || isSmallScreen) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
    >
      <Beams
        rotation={28}
        beamCount={14}
        beamWidth={2.4}
        speed={1.6}
        noiseIntensity={1.5}
      />
    </div>
  );
}
