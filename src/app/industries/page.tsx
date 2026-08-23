import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { industries } from "@/content/industries";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Who we help"
        subtitle="If your business runs on outdated tools or manual work, we can probably help — whatever industry you're in."
      />

      <Container className="grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <div
            key={industry.name}
            className="rounded-xl border border-border p-5"
          >
            <h2 className="font-semibold">{industry.name}</h2>
            <p className="mt-2 text-sm text-muted">{industry.example}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
