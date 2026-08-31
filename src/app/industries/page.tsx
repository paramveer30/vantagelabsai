import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { IndustryMarquee } from "@/components/industry-marquee";
import { IndustryScene } from "@/components/industry-scene";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { industries, type Industry } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Restaurants, retail, clinics, vets, trades, gyms, nonprofits, startups — and plenty that aren't on the list. If your business runs on manual work, we build the software that fits.",
};

function IndustryCard({
  industry,
  index,
  wide,
}: {
  industry: Industry;
  index: number;
  wide: boolean;
}) {
  const copy = (
    <div className={wide ? "mt-6 md:mt-0" : ""}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="display text-gradient mt-3 text-2xl font-semibold md:text-3xl">
        {industry.name}
      </h2>
      <p className="mt-3 text-base text-foreground md:text-lg">
        {industry.summary}
      </p>
      <p className="mt-3 text-sm text-muted">{industry.description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {industry.builds.map((build) => (
          <li
            key={build}
            className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-accent"
          >
            {build}
          </li>
        ))}
      </ul>
    </div>
  );

  const scene = (
    <div className="relative aspect-[16/10] w-full">
      <IndustryScene variant={industry.variant} />
    </div>
  );

  return (
    <Reveal
      index={index % 2}
      className={`h-full ${wide ? "md:col-span-2" : ""}`}
    >
      <article className="hud card-glow relative flex h-full flex-col rounded-2xl border border-border bg-surface/60 p-6 md:p-8">
        {wide ? (
          <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
            {scene}
            {copy}
          </div>
        ) : (
          <>
            {scene}
            <div className="mt-6">{copy}</div>
          </>
        )}
      </article>
    </Reveal>
  );
}

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Who we help"
        subtitle="From the corner café to the Series A startup — if your business runs on spreadsheets, sticky notes, or software that fights you, we build the thing that fits."
      />

      <IndustryMarquee />

      <Container className="grid gap-6 py-16 md:grid-cols-2">
        {industries.map((industry, i) => (
          <IndustryCard
            key={industry.slug}
            industry={industry}
            index={i}
            wide={industries.length % 2 === 1 && i === industries.length - 1}
          />
        ))}
      </Container>

      <Container className="pb-24">
        <div className="hud relative rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="display text-2xl font-semibold md:text-3xl">
            Don&apos;t see your industry?
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted">
            The list isn&apos;t the point — the pattern is. If your team is
            doing by hand what software should be doing, we can help. Tell us
            what&apos;s slowing you down.
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
