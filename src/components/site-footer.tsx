import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer bg-background/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">{site.name}</p>
          <p className="mt-1 text-sm text-muted">{site.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
