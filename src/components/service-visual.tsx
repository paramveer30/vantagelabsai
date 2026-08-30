"use client";

import dynamic from "next/dynamic";
import { ServiceGlyph } from "@/components/service-glyph";
import type { ServiceVariant } from "@/content/services";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/media";

// Same deal as SiteBackground: the particle canvas is a desktop, motion-OK
// nicety. Reduced motion and small screens get the flat glyph instead,
// which carries the meaning on its own.
const ServiceScene = dynamic(() => import("@/components/three/service-scene"), {
  ssr: false,
});

export function ServiceVisual({ variant }: { variant: ServiceVariant }) {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  if (reducedMotion || isSmallScreen) {
    return (
      <div className="absolute inset-0 grid place-items-center p-8">
        <ServiceGlyph variant={variant} className="max-h-40 max-w-40" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* A ghost of the glyph sits under the canvas so the box isn't empty
          while the WebGL chunk loads; the particles cover it once up. */}
      <div className="absolute inset-0 grid place-items-center p-8 opacity-15">
        <ServiceGlyph variant={variant} className="max-h-40 max-w-40" />
      </div>
      <div className="absolute inset-0">
        <ServiceScene variant={variant} />
      </div>
    </div>
  );
}
