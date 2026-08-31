"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const lastY = useRef(0);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // The scrim behind the bar is translucent, so a bar pinned over
  // scrolling content reads as an overlap. Slide it out on a downward
  // scroll and bring it back on any upward scroll or near the top.
  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 96);
      lastY.current = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      data-hidden={hidden && !open ? "true" : undefined}
      className="site-header sticky top-0 z-40"
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/brand/image.png"
            alt=""
            width={30}
            height={30}
            className="logo-mark"
            priority
          />
          <Wordmark className="display text-[1.05rem] font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="nav-link px-3 py-2"
            >
              <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="nav-cta rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
          >
            Book a call
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong text-foreground/80 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="relative flex flex-col gap-0.5 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="nav-link nav-link--stack px-3 py-2.5"
            >
              <span className="nav-index">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="nav-cta mt-3 rounded-full px-4 py-2.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
          >
            Book a call
          </Link>
        </nav>
      )}
    </header>
  );
}
