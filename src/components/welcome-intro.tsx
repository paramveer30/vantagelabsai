"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { finish, setPhase, useWelcome } from "@/lib/welcome";

const PREFIX = "Welcome to ";
const BRAND = "Vantage Labs";
const TEXT = PREFIX + BRAND;
const CHAR_MS = 52;
// Hold on just the caret briefly so the first chars don't fight the
// hydration / canvas-init burst, then type in one pass.
const START_MS = 220;
const DONE_MS = START_MS + TEXT.length * CHAR_MS + 450;

// The first-load welcome. Types the greeting over the live galaxy
// background, then hands off to the hero particle cloud, which pulls the
// drifting field inward to form the V (home), or just clears to the page
// (other routes). The head guard in the layout decides whether it runs by
// setting data-welcome; it's absent under reduced motion or on narrow
// viewports, where there's no particle V to form.
export function WelcomeIntro() {
  const w = useWelcome();
  const textRef = useRef<HTMLSpanElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const [typedDone, setTypedDone] = useState(false);
  const handedOff = useRef(false);

  // Push `n` typed characters across the two nodes: the plain prefix fills
  // first, then the styled "Vantage Labs" brand span.
  const paint = useCallback((n: number) => {
    if (textRef.current) textRef.current.textContent = TEXT.slice(0, Math.min(n, PREFIX.length));
    if (brandRef.current) {
      brandRef.current.textContent = n > PREFIX.length ? TEXT.slice(PREFIX.length, n) : "";
    }
  }, []);

  const finishTyping = useCallback(() => {
    paint(TEXT.length);
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      finish(); // no V to form here; CSS fades the page in
    } else {
      setTypedDone(true);
    }
  }, [paint]);

  // Home: hand off once typing is done AND the cloud has rendered a live
  // frame, so the implosion never starts against an init stall. Fires
  // whichever order those two land in.
  useEffect(() => {
    if (!typedDone || handedOff.current || w.phase !== "typing") return;
    if (w.cloudReady) {
      handedOff.current = true;
      setPhase("handoff"); // the <p> fades as phase leaves "typing"
    }
  }, [typedDone, w.cloudReady, w.phase]);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-welcome")) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Typewriter: one wall-clock rAF pass, written straight to the DOM node
  // so it never triggers a render, and keyed only on the phase string
  // (finishTyping is stable) so nothing re-runs and restarts it mid-type.
  useEffect(() => {
    if (w.phase !== "typing") return;
    let raf = 0;
    let start = 0;
    let shown = -1;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start - START_MS;
      const n = t < 0 ? 0 : Math.min(TEXT.length, Math.floor(t / CHAR_MS));
      if (n !== shown) {
        paint(n);
        shown = n;
      }
      if (now - start >= DONE_MS) {
        finishTyping();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [w.phase, finishTyping, paint]);

  // Nothing stalls the page: force the release after 7s no matter what.
  useEffect(() => {
    const id = window.setTimeout(finish, 7000);
    return () => window.clearTimeout(id);
  }, []);

  if (w.phase === "pending" || w.phase === "done") return null;

  const onSkip = () => {
    if (w.phase === "typing") finishTyping();
    else if (w.phase === "handoff") finish();
  };

  return (
    <div
      aria-hidden
      suppressHydrationWarning
      onClick={onSkip}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <p
        className={`display text-2xl font-semibold tracking-tight text-foreground transition-opacity duration-300 sm:text-4xl ${
          w.phase === "typing" ? "opacity-100" : "opacity-0"
        }`}
      >
        <span ref={textRef} />
        <span
          ref={brandRef}
          className="font-bold"
          style={{
            color: "#4da6ff",
            textShadow:
              "0 0 20px rgba(77, 166, 255, 0.95), 0 0 44px rgba(77, 166, 255, 0.55)",
          }}
        />
        <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.12em] animate-pulse bg-accent" />
      </p>
    </div>
  );
}
