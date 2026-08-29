import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { CtaBand, Panel } from "@/components/ui";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Restaurants, retail, clinics, veterinary practices, professional services, and startups — the businesses we build software for.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        index="02 / 05"
        title="Who we help"
        subtitle="If your business runs on outdated tools or manual work, we can probably help — whatever industry you're in."
      />

      <Container className="pb-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={i * 60}>
              <Panel interactive className="group flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="text-muted transition-colors group-hover:text-accent"
                  >
                    →
                  </span>
                </div>
                <h2 className="display mt-4 text-lg font-semibold">
                  {industry.name}
                </h2>
                <p className="mt-2 text-sm text-muted">{industry.example}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Container>

      <CtaBand
        title="Don't see your industry?"
        body="The list isn't exhaustive. If your work runs on spreadsheets, paper, or tools that don't talk to each other, we can help — book a call and tell us about it."
      />
    </>
  );
}
