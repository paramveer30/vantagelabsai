import type { ReactNode } from "react";
import Link from "next/link";
import { nav } from "@/lib/site";

const g = "h-[0.95em] w-[0.95em]";

// Line glyph per route, keyed to the shared nav list.
const icons: Record<string, ReactNode> = {
  "/services": (
    <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  ),
  "/industries": (
    <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
    </svg>
  ),
  "/process": (
    <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4a3.5 3.5 0 0 1 3.5 3.5V14" />
    </svg>
  ),
  "/work": (
    <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  "/contact": (
    <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
};

// Holographic desktop UI drawn on the particle monitor's screen. The
// wrapper is pinned to the monitor's projected screen rectangle (see the
// same fractions-of-viewport-height math in ParkourFigure.rebuild), and
// every inner size is in `em` off a viewport-height font-size, so the
// whole panel scales with the monitor at any window size and the icons
// stay inside the bezel. `active` triggers the staggered power-on.
export function DesktopNav({ active }: { active: boolean }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        // monitor screen: centre (50vw, 42.8vh), half-size (44.5vh, 28.6vh)
        left: "calc(50vw - 44.5vh)",
        top: "14.2vh",
        width: "50vh",
        height: "56.4vh",
        paddingTop: "5vh",
        paddingLeft: "8.5vh",
        fontSize: "3vh",
      }}
    >
      <div
        className={`mb-[1em] flex items-center gap-[0.33em] ${active ? "holo-in" : "opacity-0"}`}
      >
        <span className="h-[0.34em] w-[0.34em] rounded-full bg-accent shadow-[0_0_10px_2px_rgba(58,208,255,0.8)]" />
        <span className="font-mono text-[0.45em] uppercase tracking-[0.24em] text-accent/80">
          VantageLabsAI · online
        </span>
      </div>

      <ul className="flex flex-col gap-[0.62em]">
        {nav.map((item, i) => (
          <li
            key={item.href}
            className={active ? "holo-in" : "opacity-0"}
            style={active ? { animationDelay: `${0.12 + i * 0.09}s` } : undefined}
          >
            <Link href={item.href} className="group flex items-center gap-[0.55em]">
              <span className="holo hud relative grid h-[2.1em] w-[2.1em] place-items-center rounded-[0.5em] text-accent transition-all duration-200 group-hover:-translate-y-[0.06em] group-hover:text-white">
                <span className="drop-shadow-[0_0_8px_rgba(58,208,255,0.7)]">
                  {icons[item.href]}
                </span>
              </span>
              <span className="display text-[0.92em] font-semibold text-foreground/90 [text-shadow:0_0_18px_rgba(58,208,255,0.35),0_1px_10px_rgba(6,8,16,0.9)] transition-colors group-hover:text-foreground">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
