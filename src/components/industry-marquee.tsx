import { industries } from "@/content/industries";

// A glanceable band under the hero: the verticals we name on the page,
// plus a wider spread of businesses so almost any visitor spots
// themselves. Two rows drift in opposite directions and pause on hover;
// under reduced motion it collapses to a static wrapped cloud (see the
// "Industries" block in globals.css).

const MORE = [
  "Bakeries",
  "Dentists",
  "Law firms",
  "Gyms",
  "Salons & spas",
  "Real estate",
  "Auto shops",
  "Property managers",
  "E-commerce",
  "Coaches",
  "Agencies",
  "Franchises",
];

function Pill({ label }: { label: string }) {
  return (
    <li className="whitespace-nowrap rounded-full border border-border-strong px-3 py-1 font-mono text-xs text-accent">
      {label}
    </li>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const track = `ind-marquee-track flex shrink-0 items-center gap-3 ${
    reverse ? "ind-marquee-track--rev" : ""
  }`;
  return (
    <div className="ind-marquee-row flex gap-3 overflow-hidden">
      <ul className={track}>
        {items.map((t) => (
          <Pill key={t} label={t} />
        ))}
      </ul>
      <ul className={track} aria-hidden>
        {items.map((t) => (
          <Pill key={t} label={t} />
        ))}
      </ul>
    </div>
  );
}

export function IndustryMarquee() {
  return (
    <div className="relative isolate my-4 border-y border-border bg-surface/40 py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background via-background/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background via-background/80 to-transparent"
      />
      <div className="flex flex-col gap-3">
        <MarqueeRow items={industries.map((i) => i.name)} />
        <MarqueeRow items={MORE} reverse />
      </div>
    </div>
  );
}
