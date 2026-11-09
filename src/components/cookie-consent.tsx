"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/media";

// One-time notice. The site sets no tracking or advertising cookies (the
// only thing it stores is this dismissal flag), so this is a courtesy
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
  // False on the server and on the first client render, so the notice
  // mounts only client-side and never mismatches.
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(readDismissed);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "dismissed");
    } catch {
      /* private mode or storage blocked: hide it for this session */
    }
    setDismissed(true);
  }

  if (!hydrated || dismissed) return null;

  return (
    <div role="region" aria-label="Cookie notice" className="cookie-notice">
      <div>
        <p>
          We only store one setting to remember you closed this notice. No
          tracking or advertising cookies. Read the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="btn btn-primary btn-sm"
        >
          <span>Close notice</span>
        </button>
      </div>
    </div>
  );
}
