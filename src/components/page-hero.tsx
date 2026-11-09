import { SplitText } from "@/components/split-text";

// Inner-page opener. Sits on a bright stretch of the texture with a dark
// scrim on the text side; the title's last word can be set as the mint
// serif accent.
export function PageHero({
  kicker,
  title,
  accent,
  subtitle,
}: {
  kicker: string;
  title: string;
  accent?: string;
  subtitle: string;
}) {
  return (
    <section className="page-hero" data-inten="1" data-cap="0.9">
      <div className="wrap inner">
        <span className="kicker">{kicker}</span>
        <SplitText
          as="h1"
          className="display h1"
          text={title}
          accent={accent}
        />
        <p className="lede">{subtitle}</p>
      </div>
    </section>
  );
}
