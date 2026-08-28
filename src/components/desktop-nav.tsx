import type { ReactNode } from "react";
import Link from "next/link";

type App = { label: string; href: string; icon: ReactNode };

const svg = "h-7 w-7";

const apps: App[] = [
  {
    label: "Services",
    href: "/services",
    icon: (
      <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 13 9 5 9-5" />
      </svg>
    ),
  },
  {
    label: "Industries",
    href: "/industries",
    icon: (
      <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="7" width="16" height="14" rx="1" />
        <path d="M9 21v-6h6v6M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
    ),
  },
  {
    label: "Process",
    href: "/process",
    icon: (
      <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="5" cy="12" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="19" cy="18" r="2" />
        <path d="M7 12h5m0 0 5-5m-5 5 5 5" />
      </svg>
    ),
  },
  {
    label: "Work",
    href: "/work",
    icon: (
      <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 7a2 2 0 0 1 2-2h3.5l2 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/contact",
    icon: (
      <svg className={svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

export function DesktopNav() {
  return (
    <div className="flex h-[64vh] w-[min(880px,74vw)] flex-col overflow-hidden rounded-xl border border-white/15 bg-background/45 shadow-[0_0_70px_-12px_rgba(58,208,255,0.4)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          VantageLabsAI
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] -translate-x-1/2 -translate-y-1/2 text-brand/10"
          fill="currentColor"
        >
          <path d="M8 12 44 88h12L92 12H74L50 64 26 12Z" />
        </svg>

        <ul className="absolute left-6 top-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
          {apps.map((app) => (
            <li key={app.href}>
              <Link
                href={app.href}
                className="group flex w-20 flex-col items-center gap-2 text-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-accent transition-all group-hover:-translate-y-0.5 group-hover:border-accent group-hover:bg-white/[0.12]">
                  {app.icon}
                </span>
                <span className="text-xs text-foreground/80">{app.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
