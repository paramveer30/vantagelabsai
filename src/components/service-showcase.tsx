import Link from "next/link";
import type { ReactNode } from "react";
import { DentalChat } from "@/components/examples/dental-chat";
import { OrderDashboard } from "@/components/examples/order-dashboard";
import { SupportReport } from "@/components/examples/support-report";
import { SplitText } from "@/components/split-text";
import { services } from "@/content/services";

// The compact example that sits beside each service on the home page. The
// Services page shows the full versions of the same builds.
const examples: Record<string, ReactNode> = {
  "custom-software": <OrderDashboard variant="compact" />,
  "ai-automation": <DentalChat variant="compact" />,
  "ongoing-support": <SupportReport variant="compact" />,
};

// Home page: each service as a large row with readable copy on one side
// and a real-looking example build on the other, alternating sides on
// wide screens and stacking (text first) on narrow ones.
export function ServiceShowcase() {
  return (
    <div className="showcase">
      {services.map((service, i) => (
        <article
          key={service.slug}
          className={`showcase-row${i % 2 ? " flip" : ""}`}
          aria-labelledby={`showcase-${service.slug}`}
        >
          <div className="showcase-text">
            <span className="kicker">{String(i + 1).padStart(2, "0")}</span>
            <SplitText
              as="h3"
              id={`showcase-${service.slug}`}
              className="showcase-title"
              text={service.title}
            />
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
          <div className="showcase-example">{examples[service.slug]}</div>
        </article>
      ))}
    </div>
  );
}
