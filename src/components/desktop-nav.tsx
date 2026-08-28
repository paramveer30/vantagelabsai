import type { ReactNode } from "react";
import Link from "next/link";

type App = { label: string; href: string; icon: ReactNode };

const g = "h-7 w-7";

const apps: App[] = [
  {
    label: "Services",
    href: "/services",
    icon: (
      <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    label: "Industries",
    href: "/industries",
    icon: (
      <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
      </svg>
    ),
  },
  {
    label: "Process",
    href: "/process",
    icon: (
      <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <path d="M10 6.5h4a3.5 3.5 0 0 1 3.5 3.5V14" />
      </svg>
    ),
  },
  {
    label: "Work",
    href: "/work",
    icon: (
      <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/contact",
    icon: (
      <svg className={g} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

// Real desktop UI drawn on top of the particle monitor's screen (left
// half — the V wallpaper fills the right).
export function DesktopNav() {
  return (
    <div
      className="absolute"
      style={{ left: "calc(50vw - 36vh)", top: "20vh" }}
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(58,208,255,0.7)]" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-muted">
          VantageLabsAI
        </span>
      </div>

      <ul className="flex flex-col gap-5">
        {apps.map((app) => (
          <li key={app.href}>
            <Link href={app.href} className="group flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-accent/40 bg-gradient-to-br from-white/[0.12] to-white/[0.02] text-accent shadow-[0_0_30px_-6px_rgba(58,208,255,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent group-hover:text-white group-hover:shadow-[0_0_46px_-4px_rgba(58,208,255,0.95),inset_0_1px_0_rgba(255,255,255,0.22)]">
                {app.icon}
              </span>
              <span className="display text-2xl font-semibold text-foreground/90 [text-shadow:0_1px_12px_rgba(6,8,16,0.9)] transition-colors group-hover:text-foreground">
                {app.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
