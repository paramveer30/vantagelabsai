import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies from VantageLabsAI.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Selected projects"
        subtitle="Detailed case studies are in progress. Here's a look at what we've been building."
      />

      <Container className="grid gap-6 pb-24 md:grid-cols-2">
        {caseStudies.map((study) => {
          const card = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-accent">{study.industry}</span>
                {study.status === "coming-soon" && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                    Case study coming soon
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-semibold">{study.client}</h2>
              <p className="mt-2 text-sm text-muted">{study.summary}</p>
            </>
          );

          return study.status === "published" ? (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand"
            >
              {card}
            </Link>
          ) : (
            <div
              key={study.slug}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              {card}
            </div>
          );
        })}
      </Container>

      <Container className="pb-24">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-xl font-semibold">
            Want to see something specific?
          </h2>
          <p className="mt-2 text-sm text-muted">
            We can walk you through relevant past work on a call.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            Book a call
          </Link>
        </div>
      </Container>
    </>
  );
}
