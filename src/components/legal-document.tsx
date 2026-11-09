import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import {
  legalDisclaimer,
  legalEffectiveDate,
  type LegalDoc,
} from "@/content/legal";
import { site } from "@/lib/site";

const updated = new Date(`${legalEffectiveDate}T00:00:00`).toLocaleDateString(
  "en-US",
  { year: "numeric", month: "long", day: "numeric" },
);

const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Long-form legal text sits on a solid panel so it reads like a document,
// not copy floating over the texture.
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero kicker="Legal" title={doc.title} subtitle={doc.intro} />

      <div className="wrap pb-28" data-inten="0.6" data-cap="0.25">
        <article className="panel max-w-3xl gap-10 md:p-12">
          <div className="grid gap-4">
            <p className="mono-meta m-0 tracking-[0.08em] text-muted uppercase">
              Last updated: {updated}
            </p>
            <p className="copy rounded-[10px] border border-line bg-black p-5 text-sm">
              {legalDisclaimer}
            </p>
          </div>

          {doc.sections.map((section) => (
            <section
              key={section.heading}
              id={anchor(section.heading)}
              className="grid gap-3"
            >
              <h2 className="display text-2xl">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="copy">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <p className="copy text-sm">
            See also our{" "}
            <Link href={doc.slug === "privacy" ? "/terms" : "/privacy"}>
              {doc.slug === "privacy"
                ? "Terms and Conditions"
                : "Privacy Policy"}
            </Link>
            , or <a href={`mailto:${site.email}`}>email us</a> with any
            questions.
          </p>
        </article>
      </div>
    </>
  );
}
