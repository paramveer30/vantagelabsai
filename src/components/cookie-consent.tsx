"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/media";
import { useWelcome } from "@/lib/welcome";

// One-time notice. The site sets no tracking or advertising cookies — the
// only thing it stores is this dismissal flag — so this is a courtesy
// notice, not a consent gate: nothing is blocked either way.
const KEY = "vantage.cookie-notice";

function readDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(KEY) === "dismissed";
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const { phase } = useWelcome();
  // False on the server and on the first client render, true once
  // hydrated — so the banner mounts only client-side and never mismatches.
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(readDismissed);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "dismissed");
    } catch {
      /* private mode / storage blocked — just hide it for this session */
    }
    setDismissed(true);
  }

  // Not before hydration, not once dismissed, and not over the first-load
  // welcome sequence.
  if (!hydrated || dismissed || phase !== "done") return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
    >
      <div className="glass reveal flex w-full max-w-xl flex-col gap-3 rounded-xl border border-border p-4 text-sm shadow-lg shadow-black/30 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 text-muted">
          We use only essential cookies to keep this site working — no tracking
          or advertising. See our{" "}
          <Link
            href="/privacy"
            className="text-accent transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 self-start rounded-full bg-brand px-5 py-2 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand-hover sm:self-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
