import Link from "next/link";
import { Container } from "@/components/container";
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

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={doc.hero} subtitle={doc.intro} />

      <Container className="pb-28">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          Last updated: {updated}
        </p>

        <p className="mt-5 max-w-2xl rounded-2xl border border-border bg-surface/60 p-5 text-sm leading-relaxed text-muted">
          {legalDisclaimer}
        </p>

        <div className="mt-12 max-w-2xl space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading} id={anchor(section.heading)}>
              <h2 className="display text-xl font-semibold text-foreground md:text-2xl">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-3 text-base leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14 max-w-2xl text-sm text-muted">
          See also our{" "}
          <Link
            href={doc.slug === "privacy" ? "/terms" : "/privacy"}
            className="text-accent transition-colors hover:text-foreground"
          >
            {doc.slug === "privacy" ? "Terms & Conditions" : "Privacy Policy"}
          </Link>
          , or{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent transition-colors hover:text-foreground"
          >
            email us
          </a>{" "}
          with any questions.
        </p>
      </Container>
    </>
  );
}
