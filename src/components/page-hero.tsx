import { Container } from "@/components/container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Container className="py-24">
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h1 className="display mt-4 text-4xl font-semibold md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">{subtitle}</p>
    </Container>
  );
}
