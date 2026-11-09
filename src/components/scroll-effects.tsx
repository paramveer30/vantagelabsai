"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Every scroll-driven effect on the site, run from one listener so there is
// a single rAF per frame. Components opt in with data attributes:
//
//   .split, .grow, [data-reveal]  get `.in` once they scroll into view
//   [data-marquee="1|-1"]          slides sideways with scroll
//   [data-rail]                    sets --p (0..1) and lights its <li>s
//   [data-parallax]                image drifts inside its frame
//   [data-lift]                    rises and un-tilts as it enters
//
// Under reduced motion nothing moves: reveals are applied immediately, the
// rail shows fully filled, and transforms are left alone. The progress bar
// still tracks position, without easing.
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");

    const reveals = document.querySelectorAll<HTMLElement>(
      ".split, .grow, [data-reveal]",
    );
    let io: IntersectionObserver | null = null;
    if (reduced || typeof IntersectionObserver === "undefined") {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("in");
            e.target.dispatchEvent(new CustomEvent("reveal"));
            io?.unobserve(e.target);
          }
        },
        { threshold: 0.25 },
      );
      reveals.forEach((el) => io!.observe(el));
    }

    const marquees = document.querySelectorAll<HTMLElement>("[data-marquee]");
    const rails = document.querySelectorAll<HTMLElement>("[data-rail]");
    const parallax = document.querySelectorAll<HTMLElement>("[data-parallax]");
    const lifts = document.querySelectorAll<HTMLElement>("[data-lift]");

    if (reduced) {
      rails.forEach((rail) => {
        rail.style.setProperty("--p", "1");
        rail
          .querySelectorAll(":scope > ol > li")
          .forEach((li) => li.classList.add("lit"));
      });
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar) bar.style.transform = `scaleX(${progress})`;
      if (reduced) return;

      marquees.forEach((row) => {
        const r = row.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const dir = Number(row.dataset.marquee);
        const start = dir > 0 ? -row.scrollWidth * 0.35 : 0;
        row.style.transform = `translate3d(${start + (r.top - vh) * 0.45 * dir}px,0,0)`;
      });

      rails.forEach((rail) => {
        const r = rail.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.2)),
        );
        rail.style.setProperty("--p", p.toFixed(3));
        const items = rail.querySelectorAll(":scope > ol > li");
        items.forEach((li, k) =>
          li.classList.toggle("lit", p >= (k + 0.15) / items.length),
        );
      });

      parallax.forEach((img) => {
        const frame = img.parentElement?.getBoundingClientRect();
        if (!frame || frame.bottom < 0 || frame.top > vh) return;
        const k = (frame.top + frame.height / 2 - vh / 2) / vh;
        img.style.transform = `translate3d(0,${(-8 - k * 10).toFixed(2)}%,0)`;
      });

      lifts.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > vh + 100 || r.bottom < -100) return;
        const q = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.6)));
        el.style.transform = `perspective(1400px) translateY(${((1 - q) * 60).toFixed(1)}px) rotateX(${((1 - q) * 9).toFixed(2)}deg) scale(${(0.94 + q * 0.06).toFixed(3)})`;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span data-scroll-progress />
    </div>
  );
}
