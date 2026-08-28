import Link from "next/link";
import { Container } from "@/components/container";
import { industries } from "@/content/industries";
import { processSteps } from "@/content/process";
import { services } from "@/content/services";

const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[88vh] items-center">
        <Container>
          <div className="max-w-xl md:ml-[46%]">
            <p className="eyebrow text-accent">VantageLabsAI</p>
            <h1 className="display mt-4 text-4xl font-semibold sm:text-5xl">
              We build the software your business is missing.
            </h1>
            <p className="mt-5 text-lg text-muted">
              A small engineering team that designs, builds, and maintains
              custom software and AI tools — for local businesses and technical
              founders alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-all hover:bg-brand-hover hover:shadow-[0_0_40px_-8px_rgba(58,208,255,0.55)]"
              >
                Book a call
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              >
                What we do
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section id="services" className="scroll-mt-24">
        <Container className="py-24">
          <p className="eyebrow text-accent">What we do</p>
          <h2 className="display mt-3 text-3xl font-semibold">
            Three ways we help
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.slug} className={cardClass}>
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-accent">{service.summary}</p>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-8 inline-block text-sm text-accent hover:underline"
          >
            Full breakdown of our services →
          </Link>
        </Container>
      </section>

      <section>
        <Container className="py-24">
          <p className="eyebrow text-accent">Who we help</p>
          <h2 className="display mt-3 text-3xl font-semibold">
            Built for any business
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span
                key={industry.name}
                className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm backdrop-blur-sm"
              >
                {industry.name}
              </span>
            ))}
          </div>
          <Link
            href="/industries"
            className="mt-6 inline-block text-sm text-accent hover:underline"
          >
            See all industries →
          </Link>
        </Container>
      </section>

      <section>
        <Container className="py-24">
          <p className="eyebrow text-accent">How we work</p>
          <h2 className="display mt-3 text-3xl font-semibold">
            Four steps, no surprises
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.step} className={cardClass}>
                <div className="display text-2xl text-accent">
                  {String(step.step).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-28 text-center">
          <h2 className="display text-3xl font-semibold sm:text-4xl">
            Ready to talk about your project?
          </h2>
          <p className="mt-3 text-muted">Free discovery call, no obligation.</p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-brand px-7 py-3 text-sm font-medium text-brand-foreground transition-all hover:bg-brand-hover hover:shadow-[0_0_40px_-8px_rgba(58,208,255,0.55)]"
          >
            Book a call
          </Link>
        </Container>
      </section>
    </>
  );
}
