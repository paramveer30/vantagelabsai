import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { ServiceVignette } from "@/components/service-vignette";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software and web apps, AI and automation integration, and ongoing support and maintenance.",
};

export default function ServicesPage() {
  return (
    <>
      <Container className="relative isolate py-28 md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-28 -z-10 mx-auto h-[440px] max-w-[1000px] blur-[130px]"
          style={{
            background:
              "radial-gradient(58% 58% at 50% 40%, rgba(58,208,255,0.20), rgba(47,107,255,0.10) 46%, transparent 74%)",
          }}
        />

        <div className="flex items-center gap-4">
          <span className="eyebrow">Services</span>
          <span className="h-px w-24 bg-gradient-to-r from-accent/70 to-transparent" />
        </div>

        <h1 className="display mt-6 text-balance text-6xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl md:text-8xl">
          <span className="wordmark">What we build</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          Three ways we help you ship — pick one, or all three as you grow.
        </p>
      </Container>

      <Container className="space-y-10 pb-24">
        {services.map((service, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={service.slug} index={i}>
              <article className="hud card-glow relative rounded-2xl border border-border bg-surface/60 p-6 md:p-10">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                  <div
                    className={`relative mx-auto aspect-[4/3] w-full max-w-md lg:mx-0 ${
                      flip ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <ServiceVignette variant={service.variant} />
                  </div>

                  <div
                    className={`mt-8 lg:mt-0 ${flip ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <h2 className="display text-gradient mt-4 text-3xl font-semibold md:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-lg text-foreground md:text-xl">
                      {service.summary}
                    </p>
                    <p className="mt-4 text-base text-muted">
                      {service.description}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.examples.map((example) => (
                        <li
                          key={example}
                          className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-accent"
                        >
                          {example}
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
        <div className="hud relative rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="display text-2xl font-semibold md:text-3xl">
            Not sure which you need?
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted">
            Tell us what&apos;s slowing you down. We&apos;ll map it to the right
            mix on a quick call — no pitch, no obligation.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call
          </Link>
        </div>
      </Container>
    </>
  );
}
