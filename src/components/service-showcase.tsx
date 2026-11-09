"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { DentalChat } from "@/components/examples/dental-chat";
import { OrderDashboard } from "@/components/examples/order-dashboard";
import { SupportReport } from "@/components/examples/support-report";
import { services } from "@/content/services";

// The compact product shown for each service. The Services page shows the
// full versions of the same builds.
const examples: Record<string, ReactNode> = {
  "custom-software": <OrderDashboard variant="compact" />,
  "ai-automation": <DentalChat variant="compact" />,
  "ongoing-support": <SupportReport variant="compact" />,
};

// Home page "Three ways we help you ship": the three services as one row
// of tabs, and a single panel with the chosen service's copy beside its
// product, sized to fit one screen. Standard ARIA tabs: arrow keys, Home
// and End move between tabs; only the active tab is in the tab order.
export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const service = services[active];

  const focusTab = (i: number) => {
    const next = (i + services.length) % services.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  // Keyed off the tab that received the key, not state, so quick repeated
  // presses each move one step.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(i + 1),
      ArrowLeft: () => focusTab(i - 1),
      Home: () => focusTab(0),
      End: () => focusTab(services.length - 1),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="svc">
      <div className="svc-tabs" role="tablist" aria-label="Services">
        {services.map((item, i) => (
          <button
            key={item.slug}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            id={`svc-tab-${item.slug}`}
            type="button"
            role="tab"
            className="svc-tab"
            aria-selected={i === active}
            aria-controls="svc-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
            {item.tab}
          </button>
        ))}
      </div>

      <div
        id="svc-panel"
        role="tabpanel"
        aria-labelledby={`svc-tab-${service.slug}`}
        className="svc-panel"
      >
        {/* Keyed so each switch remounts and replays the entrance. */}
        <div key={service.slug} className="svc-grid ind-swap">
          <div className="svc-text">
            <h3 className="sr-only">{service.title}</h3>
            <p className="showcase-summary">{service.summary}</p>
            <p className="copy">{service.description}</p>
            <ul className="showcase-builds" aria-label="Typical builds">
              {service.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
            <Link className="link" href={`/services#${service.slug}`}>
              {service.exampleLabel}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <div className="svc-product">{examples[service.slug]}</div>
        </div>
      </div>
    </div>
  );
}
