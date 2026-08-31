import Image from "next/image";

// A framed browser-window screenshot of a live project, used as the
// thumbnail on the work page. Static markup, no client JS; the frame
// glow (vg-frame) is the same one the services/industries vignettes use
// and is held still under prefers-reduced-motion in globals.css.
export function SiteThumbnail({
  src,
  alt,
  label,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
}) {
  return (
    <div className="vg-frame absolute inset-0 overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex h-7 items-center gap-2 border-b border-border px-3">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
        <span className="ml-1 truncate font-mono text-[10px] tracking-wide text-muted">
          {label}
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-[#4ade80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
          live
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-7">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 90vw, 30vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
