import type { ReactNode } from "react";
import { DentalChat } from "@/components/examples/dental-chat";
import { InvoiceIntake } from "@/components/examples/invoice-intake";
import { OrderApp } from "@/components/examples/order-app";
import { OrderDashboard } from "@/components/examples/order-dashboard";
import { SupportReport } from "@/components/examples/support-report";
import { FinalCta } from "@/components/final-cta";
import { PageHero } from "@/components/page-hero";
import { SplitText } from "@/components/split-text";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Custom software and web apps, AI and automation integration, and ongoing support and maintenance, each shown with an example build.",
  path: "/services",
});

// Which example builds sit under each service.
const examples: Record<string, ReactNode> = {
  "custom-software": (
    <>
      <OrderDashboard />
      <OrderApp />
    </>
  ),
  "ai-automation": (
    <>
      <DentalChat />
      <InvoiceIntake />
    </>
  ),
  "ongoing-support": <SupportReport />,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="What we"
        accent="build"
        subtitle="Three ways we help you ship. Each one comes with a look at what you would actually get."
      />

      {services.map((service, i) => (
        <section
          key={service.slug}
          id={service.slug}
          className="service-block scroll-mt-8"
          data-inten="0.75"
          data-cap="0.3"
          aria-labelledby={`${service.slug}-title`}
        >
          <div className="wrap inner">
            <div className="service-head">
              <div>
                <span className="kicker">{String(i + 1).padStart(2, "0")}</span>
                <SplitText
                  id={`${service.slug}-title`}
                  className="display h2 mt-3"
                  text={service.title}
                />
              </div>
              <div>
                <p className="service-summary">{service.summary}</p>
                <p className="copy mt-3">{service.description}</p>
                <ul className="chip-list" aria-label="Typical builds">
                  {service.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
            {examples[service.slug]}
          </div>
        </section>
      ))}

      <FinalCta
        title="Not sure which you"
        accent="need?"
        body="Tell us what's slowing you down. We'll map it to the right mix on a quick call. No pitch, no obligation."
      />
    </>
  );
}
