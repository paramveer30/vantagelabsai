import Image from "next/image";
import type { Project } from "@/content/work";

// medicine4youth.ca -> medicine4youth.ca (drops protocol + www)
export function domain(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

// A shipped project with its real screenshot. The image drifts slightly
// inside its frame on scroll (data-parallax). `feature` shows the summary.
export function ProjectCard({
  project,
  feature = false,
  priority = false,
}: {
  project: Project;
  feature?: boolean;
  priority?: boolean;
}) {
  return (
    <article className={`card${feature ? " feature" : ""}`}>
      <div className="shot">
        <Image
          data-parallax
          src={project.image}
          alt={project.imageAlt}
          fill
          priority={priority}
          sizes={
            feature
              ? "(max-width: 960px) 92vw, 640px"
              : "(max-width: 960px) 92vw, 460px"
          }
        />
      </div>
      <div className="card-body">
        <p className="card-meta">
          {project.category} · {project.year}
        </p>
        <h3 className="h3">{project.name}</h3>
        {feature ? <p className="copy">{project.summary}</p> : null}
        <a
          className="link justify-self-start text-sm"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {domain(project.url)}
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
