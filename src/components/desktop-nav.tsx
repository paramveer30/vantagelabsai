import type { ReactNode } from "react";
import Link from "next/link";
import { nav } from "@/lib/site";

const g = "h-7 w-7";

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

// Holographic desktop UI drawn on the particle monitor's screen (left
// half — the V wallpaper fills the right). `active` triggers the
// staggered power-on when the computer finishes forming.
export function DesktopNav({ active }: { active: boolean }) {
  return (
    <div className="absolute" style={{ left: "calc(50vw - 36vh)", top: "20vh" }}>
      <div
        className={`mb-6 flex items-center gap-2 ${active ? "holo-in" : "opacity-0"}`}
      >
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(58,208,255,0.8)]" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-accent/80">
          VantageLabsAI · online
        </span>
      </div>

      <ul className="flex flex-col gap-5">
        {nav.map((item, i) => (
          <li
            key={item.href}
            className={active ? "holo-in" : "opacity-0"}
            style={active ? { animationDelay: `${0.12 + i * 0.09}s` } : undefined}
          >
            <Link href={item.href} className="group flex items-center gap-4">
              <span className="holo hud relative grid h-16 w-16 place-items-center rounded-xl text-accent transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-white">
                <span className="drop-shadow-[0_0_8px_rgba(58,208,255,0.7)]">
                  {icons[item.href]}
                </span>
              </span>
              <span className="display text-2xl font-semibold text-foreground/90 [text-shadow:0_0_18px_rgba(58,208,255,0.35),0_1px_10px_rgba(6,8,16,0.9)] transition-colors group-hover:text-foreground">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
