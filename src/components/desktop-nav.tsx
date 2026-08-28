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

// Sits inside the particle monitor: a small menu bar and desktop icons,
// aligned top-left like a real desktop. No wrapping panel — the particle
// monitor is the frame.
export function DesktopNav() {
  return (
    <div className="relative flex w-[min(1120px,54vw)] flex-col gap-4 pl-[3vw]">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(58,208,255,0.6)]" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
          VantageLabsAI
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {apps.map((app) => (
          <li key={app.href}>
            <Link href={app.href} className="group flex items-center gap-4">
              <span className="pixel-tile grid h-14 w-14 shrink-0 place-items-center rounded-xl text-accent transition-transform group-hover:-translate-y-0.5 group-hover:text-white">
                {app.icon}
              </span>
              <span className="display text-2xl font-semibold text-foreground/85 transition-colors group-hover:text-foreground [text-shadow:0_1px_10px_rgba(6,8,16,0.95)]">
                {app.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
