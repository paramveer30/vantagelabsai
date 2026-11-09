"use client";

import Link from "next/link";
import { useState } from "react";
import { industryMocks } from "@/components/industry-mocks";
import { industries } from "@/content/industries";

// "Who we build for": the industries as a big list; picking one shows
// what we'd build for that kind of business, with the product screen
// itself. Hover previews on wide pointer screens, click or keyboard
// everywhere. On narrow screens the list becomes a scrolling row of chips
// above the detail.
export function IndustryShowcase() {
  const [active, setActive] = useState(0);
  const industry = industries[active];
  const mock = industryMocks[industry.slug];

  const preview = (i: number) => {
    if (window.matchMedia("(hover: hover) and (min-width: 1000px)").matches) {
      setActive(i);
    }
  };

  return (
    <div className="ind-grid">
      <ul className="ind-list" aria-label="Industries">
        {industries.map((item, i) => (
          <li key={item.slug}>
            <button
              type="button"
              aria-pressed={i === active}
              aria-controls="industry-detail"
              onClick={() => setActive(i)}
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
          <Link
            className="link justify-self-start"
            href={`/industries#${industry.slug}`}
          >
            More on {industry.name.toLowerCase()}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
