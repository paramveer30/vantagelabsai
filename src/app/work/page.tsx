import Image from "next/image";
import { FinalCta } from "@/components/final-cta";
import { PageHero } from "@/components/page-hero";
import { domain } from "@/components/project-card";
import { SplitText } from "@/components/split-text";
import { projects } from "@/content/work";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "A look at what VantageLabsAI has shipped: live products designed, built, and launched end to end.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        kicker="Work"
        title="What we've"
        accent="shipped"
        subtitle="Real products, live in the world, each one designed, built, and launched end to end."
      />

      {projects.map((project, i) => (
        <section
          key={project.slug}
          className="service-block"
          data-inten="0.75"
          data-cap="0.3"
          aria-labelledby={`${project.slug}-title`}
        >
          <div className="wrap grid gap-8 py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`card relative block ${i % 2 ? "lg:order-2" : ""}`}
            >
              <span className="shot block">
                <Image
                  data-parallax
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 92vw, 560px"
                />
              </span>
              <span className="sr-only">Open {project.name} in a new tab</span>
            </a>

            <div className="grid gap-4">
              <p className="card-meta">
                {project.category} · {project.year}
              </p>
              <SplitText
                id={`${project.slug}-title`}
                className="display h2"
                text={project.name}
              />
              <p className="m-0 text-lg text-text md:text-xl">{project.summary}</p>
              <p className="copy">{project.description}</p>
              <ul className="chip-list" aria-label="Built with">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link mt-2 justify-self-start"
              >
                Visit {domain(project.url)}
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>
      ))}

      <FinalCta
        title="Have something you want"
        accent="built?"
        body="Tell us what you have in mind. We'll walk you through relevant past work and map out how we'd approach it, on a quick call, no obligation."
      />
    </>
  );
}
