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
    <Container className="py-20">
      <p className="text-sm font-medium text-accent">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{subtitle}</p>
    </Container>
  );
}
