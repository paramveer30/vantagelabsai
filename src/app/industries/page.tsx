import { FinalCta } from "@/components/final-cta";
import { IndustryShowcase } from "@/components/industry-showcase";
import { Marquee } from "@/components/marquee";
import { PageHero } from "@/components/page-hero";
import { industries } from "@/content/industries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "Restaurants, retail, clinics, vets, trades, gyms, nonprofits, startups, and plenty that aren't on the list. If your business runs on manual work, we build the software that fits.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        kicker="Industries"
        title="Who we"
        accent="help"
        subtitle="From the corner café to the Series A startup: if your business runs on spreadsheets, sticky notes, or software that fights you, we build the thing that fits."
      />

      <Marquee
        label="Industries we work with"
        primary={industries.map((i) => i.name)}
        secondary={industries.flatMap((i) => i.builds.slice(0, 1))}
      />

      <section
        className="section"
        data-inten="0.75"
        data-cap="0.3"
        aria-labelledby="industries-pick"
      >
        <div className="wrap">
          <h2 id="industries-pick" className="kicker m-0">
            Pick your industry to see what we&apos;d build
          </h2>
          <IndustryShowcase linkToPage={false} />
        </div>
      </section>

      <FinalCta
        title="Don't see your"
        accent="industry?"
        body="If your team is doing by hand what software should be doing, we can help. Tell us what's slowing you down."
      />
    </>
  );
}
