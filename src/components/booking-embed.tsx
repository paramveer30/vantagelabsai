"use client";

import { useMemo, useState } from "react";

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
    setIfAbsent("background_color", "0c1120");
    setIfAbsent("text_color", "eef2fb");
    setIfAbsent("primary_color", "2f6bff");
    setIfAbsent("hide_gdpr_banner", "1");
  } else {
    setIfAbsent("theme", "dark");
  }

  return parsed.toString();
}

export function BookingEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = useMemo(() => withThemeParams(url), [url]);

  return (
    <div className="hud card-glow relative mt-4 h-[560px] w-full rounded-2xl border border-border bg-surface sm:h-[640px]">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-surface">
          <div className="flex flex-col items-center gap-3 text-muted">
            <span
              aria-hidden="true"
              className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent motion-reduce:animate-none"
            />
            <span className="text-sm">Loading the scheduler…</span>
          </div>
        </div>
      )}
      <iframe
        src={src}
        title="Schedule a call with VantageLabsAI"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full rounded-2xl border-0"
      />
    </div>
  );
}
