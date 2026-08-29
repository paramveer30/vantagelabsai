"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades + lifts its children into view the first time they're scrolled
// near. Pairs with the `.reveal-on-scroll` / `.is-visible` rules in
// globals.css, and no-ops under prefers-reduced-motion.
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setShown(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-on-scroll ${shown ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
