import Link from "next/link";
import { Container } from "@/components/container";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-32">
          <p className="eyebrow text-accent">Custom Software &amp; AI</p>
          <h1 className="display mt-5 max-w-4xl text-5xl font-semibold md:text-7xl">
            Build any software.{" "}
            <span className="text-gradient">Solve anything.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{site.description}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-all hover:bg-brand-hover hover:shadow-[0_0_40px_-8px_rgba(58,208,255,0.55)]"
            >
              Book a call
            </Link>
            <Link
              href="/process"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface"
            >
              See how we work
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="py-20">
          <h2 className="display text-3xl font-semibold">What we build</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href="/services"
                className="card-glow rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted">{service.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <h2 className="display text-3xl font-semibold">Who we help</h2>
          <p className="mt-2 text-muted">
            If your business runs on outdated tools or manual work, we can
            probably help.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <span
                key={industry.name}
                className="rounded-full border border-border px-4 py-2 text-sm"
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

      <section className="border-t border-border bg-surface">
        <Container className="flex flex-col items-start gap-4 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display text-3xl font-semibold">
              Ready to talk about your project?
            </h2>
            <p className="mt-2 text-muted">
              Free discovery call, no obligation.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call
          </Link>
        </Container>
      </section>
    </>
  );
}
