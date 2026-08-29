import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand, Panel } from "@/components/ui";
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
        index="01 / 05"
        title="What we build"
        subtitle="Three ways we help — pick one, or all three as your business grows."
      />

      <Container className="pb-28">
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <Panel interactive className="flex h-full flex-col">
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="display mt-3 text-xl font-semibold">
                  {service.title}
                </h2>
                <p className="mt-2 text-sm text-accent/90">{service.summary}</p>
                <p className="mt-4 text-sm text-muted">{service.description}</p>
                <ul className="mt-6 space-y-2 border-t border-border pt-4">
                  {service.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2 text-sm text-foreground/80"
                    >
                      <span aria-hidden className="text-accent">
                        ▸
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
