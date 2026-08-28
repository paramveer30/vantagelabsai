import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
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

      <Container className="grid gap-8 pb-24 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.slug}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-accent">{service.summary}</p>
            <p className="mt-4 text-sm text-muted">{service.description}</p>
            <ul className="mt-4 space-y-2">
              {service.highlights.map((highlight) => (
                <li key={highlight} className="text-sm text-foreground/80">
                  · {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </>
  );
}
