"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/media";

const INTERVAL_MS = 2400;

// Cycles the hero's "business" through real verticals from the Industries
// page. The outgoing word slides up and out while the next slides in from
// below (keyframes in globals.css, so freshly mounted words animate with
// no blank frame). The first word is what the server renders and what
// screen readers get (the heading carries an aria-label with the plain
// sentence); under reduced motion it never changes.
export function RotatingWord({ words }: { words: readonly string[] }) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<{ index: number; prev: number | null }>({
    index: 0,
    prev: null,
  });
  const boxRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setState(({ index }) => ({
        index: (index + 1) % words.length,
        prev: index,
      }));
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  // Track the current word's width so the line reflows smoothly.
  useLayoutEffect(() => {
    const box = boxRef.current;
    const word = currentRef.current;
    if (!box || !word) return;
    const size = () => {
      box.style.width = `${word.offsetWidth}px`;
    };
    size();
    document.fonts?.ready.then(size).catch(() => {});
  }, [state.index]);

  const { index, prev } = state;

  return (
    <span ref={boxRef} className="rotating-word serif" aria-hidden="true">
      {prev !== null ? (
        <span key={`out-${prev}-${index}`} className="word-out">
          {words[prev]}
        </span>
      ) : null}
      <span
        key={`in-${index}`}
        ref={currentRef}
        className={prev !== null ? "word-in" : undefined}
      >
        {words[index]}
      </span>
    </span>
  );
}
