import { FinalCta } from "@/components/final-cta";
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

      <section className="section" data-inten="0.75" data-cap="0.3">
        <div className="wrap">
          <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
            {industries.map((industry, i) => (
              <li
                key={industry.slug}
                id={industry.slug}
                className={`card scroll-mt-8 ${
                  industries.length % 2 === 1 && i === industries.length - 1
                    ? "md:col-span-2"
                    : ""
                }`}
              >
                <div className="card-body gap-3 p-6 md:p-8">
                  <h2 className="display text-[1.75rem]">{industry.name}</h2>
                  <p className="m-0 text-lg text-text">{industry.summary}</p>
                  <p className="copy">{industry.description}</p>
                  <ul className="chip-list" aria-label="What we build">
                    {industry.builds.map((build) => (
                      <li key={build}>{build}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
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
