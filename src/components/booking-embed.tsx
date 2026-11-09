"use client";

import { useEffect, useMemo, useState } from "react";

// Append dark-theme query params for the known providers, leaving any the
// URL already carries untouched. Cal.com reads `theme`; Calendly takes bare
// hex colours (no leading '#'). Anything else falls back to Cal.com's param.
function withThemeParams(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const setIfAbsent = (key: string, value: string) => {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  };

  if (host === "calendly.com" || host.endsWith(".calendly.com")) {
    setIfAbsent("background_color", "0a1117");
    setIfAbsent("text_color", "f2f5f7");
    setIfAbsent("primary_color", "fc734d");
    setIfAbsent("hide_gdpr_banner", "1");
  } else {
    setIfAbsent("theme", "dark");
  }

  return parsed.toString();
}

export function BookingEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = useMemo(() => withThemeParams(url), [url]);

  // The provider's SPA can miss the iframe load event; clear the overlay
  // after a grace period regardless so it never sticks.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[10px] border border-line bg-black sm:h-[600px]">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-black">
          <div className="flex flex-col items-center gap-3 text-muted">
            <span
              aria-hidden="true"
              className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-accent motion-reduce:animate-none"
            />
            <span className="text-sm">Loading the scheduler…</span>
          </div>
        </div>
      )}
      <iframe
        src={src}
        title="Schedule a call with VantageLabsAI"
        onLoad={() => setLoaded(true)}
        className="h-full w-full border-0"
      />
    </div>
  );
}
