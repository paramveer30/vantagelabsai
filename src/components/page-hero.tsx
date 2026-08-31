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
    <Container className="relative isolate py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-28 -z-10 mx-auto h-[440px] max-w-[1000px] blur-[130px]"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 40%, rgba(58,208,255,0.20), rgba(47,107,255,0.10) 46%, transparent 74%)",
        }}
      />

      <div className="flex items-center gap-4">
        <span className="eyebrow">{eyebrow}</span>
        <span className="h-px w-24 bg-gradient-to-r from-accent/70 to-transparent" />
      </div>

      <h1 className="display mt-6 text-balance text-6xl font-semibold leading-[1] tracking-[-0.035em] sm:text-7xl md:text-8xl">
        <span className="wordmark">{title}</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
        {subtitle}
      </p>
    </Container>
  );
}
