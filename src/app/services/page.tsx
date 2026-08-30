import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ServiceVisual } from "@/components/service-visual";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software and web apps, AI and automation integration, and ongoing support and maintenance.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build"
        subtitle="Three ways we help — pick one, or all three as your business grows."
      />

      <Container className="space-y-10 pb-24">
        {services.map((service, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={service.slug} index={i}>
              <article className="hud card-glow relative rounded-2xl border border-border bg-surface/60 p-6 md:p-10">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                  <div
                    className={`relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:mx-0 ${
                      flip ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <ServiceVisual variant={service.variant} />
                  </div>

                  <div
                    className={`mt-6 lg:mt-0 ${flip ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <span className="font-mono text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="display mt-2 text-2xl font-semibold md:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-accent">{service.summary}</p>
                    <p className="mt-4 text-sm text-muted">
                      {service.description}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {service.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2.5 text-sm text-foreground/80"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden
                            className="mt-1 h-3 w-3 shrink-0 text-accent"
                          >
                            <path
                              d="M3 8.5l3.5 3.5L13 4"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </Container>

      <Container className="pb-24">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-xl font-semibold">Not sure which you need?</h2>
          <p className="mt-2 text-sm text-muted">
            Tell us what&apos;s slowing you down and we&apos;ll help you scope it
            on a call.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call
          </Link>
        </div>
      </Container>
    </>
  );
}
