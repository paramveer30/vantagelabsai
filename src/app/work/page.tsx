import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteThumbnail } from "@/components/site-thumbnail";
import { projects } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A look at what VantageLabsAI has shipped: live products designed, built, and launched end to end.",
};

// medicine4youth.ca -> medicine4youth.ca (drops protocol + www)
function domain(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="What we've shipped"
        subtitle="Real products, live in the world, each one designed, built, and launched end to end."
      />

      <Container className="space-y-10 pb-8">
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={project.slug} index={i}>
              <article className="hud card-glow relative rounded-2xl border border-border bg-surface/60 p-6 md:p-10">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} in a new tab`}
                    className={`relative mx-auto block aspect-[16/10] w-full max-w-md lg:mx-0 ${
                      flip ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <SiteThumbnail
                      src={project.image}
                      alt={project.imageAlt}
                      label={domain(project.url)}
                      priority={i === 0}
                    />
                  </a>

                  <div
                    className={`mt-8 lg:mt-0 ${flip ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <h2 className="display text-gradient mt-4 text-3xl font-semibold md:text-4xl">
                      {project.name}
                    </h2>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wider text-accent">
                      {project.category} · {project.year}
                    </p>
                    <p className="mt-4 text-lg text-foreground md:text-xl">
                      {project.summary}
                    </p>
                    <p className="mt-4 text-base text-muted">
                      {project.description}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-accent"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/[0.06]"
                    >
                      Visit site
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </Container>

      <Container className="pb-24">
        <div className="hud relative rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="display text-2xl font-semibold md:text-3xl">
            Have something you want built?
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted">
            Tell us what you have in mind. We&apos;ll walk you through relevant
            past work and map out how we&apos;d approach it, on a quick call,
            no obligation.
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
