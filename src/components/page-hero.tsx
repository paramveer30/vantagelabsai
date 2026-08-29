import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";

// Shared top-of-page block for the secondary routes. `index` is the
// section's number in the site nav (e.g. "01 / 05") so the pages stay
// tied to the home desktop. `children` is an optional slot for actions.
export function PageHero({
  eyebrow,
  title,
  subtitle,
  index,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  index?: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pb-16 pt-20 sm:pt-28">
      <Reveal>
        <SectionLabel index={index}>{eyebrow}</SectionLabel>
        <h1 className="display text-gradient mt-6 max-w-4xl text-balance text-4xl font-semibold sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-muted">
          {subtitle}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Reveal>
    </Container>
  );
}
