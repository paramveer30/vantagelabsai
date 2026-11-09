import { FinalCta } from "@/components/final-cta";
import { PageHero } from "@/components/page-hero";
import { ProcessSteps } from "@/components/process-steps";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Process",
  description:
    "How we work: discovery call, plan and design, build and iterate, launch and support.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        kicker="Process"
        title="How we"
        accent="work"
        subtitle="Four steps, no surprises. You'll know what's happening at every stage."
      />

      <section className="section section-tight-top" data-inten="0.75" data-cap="0.3">
        <div className="wrap">
          <ProcessSteps detailed />
        </div>
      </section>

      <FinalCta
        title="Know what you want"
        accent="built?"
        body="Start with the discovery call, a free, no-obligation chat about the problem and whether we're the right fit."
      />
    </>
  );
}
