"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { industryMocks } from "@/components/industry-mocks";
import { industries } from "@/content/industries";

// The URL hash (e.g. /industries#veterinary-practices) picks the starting
// industry, so links from elsewhere open the right one. Read through a
// store rather than an effect so there's no flash of the wrong industry.
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => window.location.hash.slice(1);
const serverHash = () => "";

// "Who we build for": the industries as a big list; picking one shows
// what we'd build for that kind of business, with the product screen
// itself. Hover previews on wide pointer screens, click or keyboard
// everywhere. On narrow screens the list becomes a scrolling row of chips
// above the detail.
export function IndustryShowcase({
  linkToPage = true,
}: {
  /** Show the "More on…" link to /industries (off on that page itself). */
  linkToPage?: boolean;
}) {
  const hash = useSyncExternalStore(subscribeHash, readHash, serverHash);
  const fromHash = industries.findIndex((i) => i.slug === hash);
  // A click overrides the hash until the hash itself changes again.
  const [picked, setPicked] = useState<{ index: number; hash: string } | null>(
    null,
  );
  const active =
    picked && picked.hash === hash
      ? picked.index
      : fromHash >= 0
        ? fromHash
        : 0;

  const industry = industries[active];
  const mock = industryMocks[industry.slug];

  const pick = (i: number) => setPicked({ index: i, hash });
  const preview = (i: number) => {
    if (window.matchMedia("(hover: hover) and (min-width: 1000px)").matches)
      pick(i);
  };

  return (
    <div className="ind-grid">
      <ul className="ind-list" aria-label="Industries">
        {industries.map((item, i) => (
          <li key={item.slug}>
            {/* The id lets /industries#slug scroll here. */}
            <button
              id={item.slug}
              type="button"
              className="scroll-mt-24"
              aria-pressed={i === active}
              aria-controls="industry-detail"
              onClick={() => pick(i)}
              onMouseEnter={() => preview(i)}
            >
              <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      <div id="industry-detail" className="ind-detail" aria-live="polite">
        {/* Keyed so each switch remounts and replays the entrance. */}
        <div key={industry.slug} className="ind-swap">
          <p className="ind-sum">{industry.summary}</p>
          <p className="copy">{industry.description}</p>
          <ul className="ind-builds" aria-label="What we build">
            {industry.builds.map((build) => (
              <li key={build}>{build}</li>
            ))}
          </ul>
          {mock ? (
            <figure className="m-0 grid gap-3">
              <figcaption className="text-sm text-text-2">
                {mock.app}
              </figcaption>
              <mock.Screen />
            </figure>
          ) : null}
          {linkToPage ? (
            <Link
              className="link justify-self-start"
              href={`/industries#${industry.slug}`}
            >
              More on {industry.name.toLowerCase()}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ) : (
            <Link className="link justify-self-start" href="/contact">
              Book a call about your project
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
