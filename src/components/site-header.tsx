"use client";

import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  // The menu remembers which route it was opened on, so navigating
  // anywhere closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (v: boolean) => boolean) =>
    setOpenOn(fn(open) ? pathname : null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" data-inten="1" data-cap="1">
      <div className="wrap bar">
        <Link href="/" className="brand">
          <BrandMark size={34} />
          <Wordmark />
        </Link>

        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-cta">
          <Link href="/contact" className="btn btn-primary btn-sm">
            <span>Book a call</span>
          </Link>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary">
            <span>Book a call</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
