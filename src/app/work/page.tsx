import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SiteThumbnail } from "@/components/site-thumbnail";
import { projects } from "@/content/work";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A look at what VantageLabsAI has shipped — live products designed, built, and launched end to end.",
};

// medicine4youth.ca -> medicine4youth.ca (drops protocol + www)
function domain(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-0.5"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden
          className={`h-4 w-4 ${i < rating ? "text-accent" : "text-white/15"}`}
        >
          <path
            fill="currentColor"
            d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85z"
          />
        </svg>
      ))}
    </span>
  );
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="What we've shipped"
        subtitle="Real products, live in the world — each one designed, built, and launched end to end."
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

      <Container className="pb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-accent">
            {String(projects.length + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
          Example layout · placeholder
        </span>
        <h2 className="display text-gradient mt-4 text-3xl font-semibold md:text-4xl">
          Client testimonials
        </h2>
        <p className="mt-3 max-w-xl text-base text-muted">
          This section is a placeholder. The cards below show the layout with
          example copy &mdash; they are not real reviews. Genuine client
          testimonials will land here as projects wrap.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <Reveal key={i} index={i}>
              <figure className="hud card-glow relative flex h-full flex-col rounded-2xl border border-border bg-surface/60 p-6">
                <Stars rating={testimonial.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-xs text-muted">
                  Client name, role{" "}
                  <span className="italic text-muted/70">(sample)</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        <div className="hud relative rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="display text-2xl font-semibold md:text-3xl">
            Have something you want built?
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted">
            Tell us what you have in mind. We&apos;ll walk you through relevant
            past work and map out how we&apos;d approach it — on a quick call,
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
