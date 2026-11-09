// Two oversized rows that slide in opposite directions as the page scrolls
// (driven by ScrollEffects via data-marquee). The first row names real
// things from the services list; the second, decorative, names the
// industries they're built for. Each row repeats its items so the edges
// never run out while it moves.
function Row({
  items,
  dir,
  outline = false,
  hidden = false,
}: {
  items: readonly string[];
  dir: 1 | -1;
  outline?: boolean;
  hidden?: boolean;
}) {
  const repeated = [...items, ...items];
  return (
    <div
      className={`marquee-row${outline ? " outline" : ""}`}
      data-marquee={dir}
      aria-hidden={hidden || undefined}
    >
      {repeated.map((item, i) => (
        <span key={`${item}-${i}`} aria-hidden={i >= items.length || undefined}>
          {item}
          <i aria-hidden="true"> ●</i>
        </span>
      ))}
    </div>
  );
}

export function Marquee({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: readonly string[];
  secondary: readonly string[];
}) {
  return (
    <section className="marquee" data-inten="1" data-cap="1" aria-label={label}>
      <Row items={primary} dir={-1} />
      <Row items={secondary} dir={1} outline hidden />
    </section>
  );
}
