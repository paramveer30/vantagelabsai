import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer bg-background/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={28}
                height={28}
                className="logo-mark"
              />
              <Wordmark className="display text-[1.05rem] font-semibold tracking-tight" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {site.tagline}.
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-cta mt-5 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
            >
              Book a call
              <span aria-hidden>&rarr;</span>
            </a>
          </div>

          <nav className="flex flex-col gap-2.5">
            <p className="footer-heading">Sitemap</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <p className="footer-heading">Get in touch</p>
            <a href={`mailto:${site.email}`} className="footer-link">
              {site.email}
            </a>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Schedule a call
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} <Wordmark className="font-medium text-foreground/70" />.
            All rights reserved.
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.14em]">
            Custom software &middot; AI integration &middot; ongoing support
          </p>
        </div>
      </div>
    </footer>
  );
}
