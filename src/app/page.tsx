import Link from "next/link";
import { FinalCta } from "@/components/final-cta";
import { Marquee } from "@/components/marquee";
import { ProcessSteps } from "@/components/process-steps";
import { ProjectCard } from "@/components/project-card";
import { GlassV } from "@/components/glass-v";
import { IndustryShowcase } from "@/components/industry-showcase";
import { RotatingWord } from "@/components/rotating-word";
import { ServiceShowcase } from "@/components/service-showcase";
import { SplitText, Word } from "@/components/split-text";
import { projects } from "@/content/work";

const intro =
  "A small engineering team that designs, builds and maintains custom software and AI tools for local businesses and technical founders alike.";

// "business" first: it's what the server renders and what reduced motion
// keeps. The rest are verticals from the Industries page.
const rotatingWords = [
  "business",
  "clinic",
  "bakery",
  "café",
  "law firm",
  "gym",
  "startup",
  "nonprofit",
] as const;

const marqueeBuilds = [
  "Booking systems",
  "Support chatbots",
  "Client portals",
  "Order apps",
  "Invoice automation",
  "Dashboards",
] as const;

const marqueeFor = [
  "for clinics",
  "for bakeries",
  "for trades",
  "for startups",
  "for gyms",
  "for nonprofits",
] as const;

export default function Home() {
  const [feature, ...rest] = projects;

  return (
    <>
      <section
        className="hero"
        data-inten="1"
        data-cap="1"
        aria-labelledby="hero-title"
      >
        <div className="wrap inner hero-grid">
          <div className="hero-copy">
            <h1
              id="hero-title"
              className="display h1 hero-title"
              aria-label="We build the software your business is missing."
            >
              {/* Fixed line breaks so the headline never re-wraps as the
                  rotating word changes width. Phones give the word its own
                  line; wider screens keep it with "is missing." */}
              <span aria-hidden="true">
                <span className="hero-line">
                  <Word index={0}>We</Word>
                  <Word index={1}>build</Word>
                  <Word index={2}>the</Word>
                </span>
                <span className="hero-line">
                  <Word index={3}>software</Word>
                  <Word index={4}>your</Word>
                </span>
                <span className="hero-line hero-last">
                  <Word index={5}>
                    <RotatingWord words={rotatingWords} />
                  </Word>
                  <span className="hero-break" />
                  <Word index={6}>is</Word>
                  <Word index={7}>missing.</Word>
                </span>
              </span>
            </h1>
            <p
              className="lede fade-up"
              style={{ "--d": "0.75s" } as React.CSSProperties}
            >
              {intro}
            </p>
            <div
              className="actions fade-up"
              style={{ "--d": "0.9s" } as React.CSSProperties}
            >
              <Link href="/contact" className="btn btn-primary">
                <span>Book a call</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link href="/services" className="btn btn-ghost">
                <span>See the example builds</span>
              </Link>
            </div>
            <ul
              className="dot-list fade-up"
              style={{ "--d": "1.05s" } as React.CSSProperties}
            >
              <li>Custom software</li>
              <li>AI and automation</li>
              <li>Ongoing support</li>
            </ul>
          </div>
          <GlassV />
        </div>
      </section>

      <section
        className="section"
        data-inten="0.8"
        data-cap="0.3"
        aria-labelledby="what-we-do"
      >
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">What we do</span>
            <SplitText
              id="what-we-do"
              className="display h2"
              text="Three ways we help you ship"
            />
            <p className="copy">
              Pick one, or all three as you grow. Every service comes with an
              example of what you&apos;d actually get.
            </p>
          </div>
          <ServiceShowcase />
        </div>
      </section>

      <Marquee
        label="Things we build"
        primary={marqueeBuilds}
        secondary={marqueeFor}
      />

      <section
        className="section"
        data-inten="0.8"
        data-cap="0.3"
        aria-labelledby="shipped"
      >
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Shipped</span>
            <SplitText
              id="shipped"
              className="display h2"
              text="What we've shipped"
            />
            <p className="copy">
              Live products, each one designed, built and launched end to end.
            </p>
          </div>
          <div className="work-grid">
            <ProjectCard project={feature} feature />
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <p className="mt-6">
            <Link href="/work" className="link">
              See all our work
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </p>
        </div>
      </section>

      <section
        className="section section-tight-top"
        data-inten="0.8"
        data-cap="0.3"
        aria-labelledby="how-we-work"
      >
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Process</span>
            <SplitText
              id="how-we-work"
              className="display h2"
              text="How we work"
            />
            <p className="copy">
              Four steps, no surprises. You&apos;ll know what&apos;s happening
              at every stage.
            </p>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <section
        className="section section-tight-top"
        data-inten="0.8"
        data-cap="0.3"
        aria-labelledby="who-for"
      >
        <div className="wrap">
          <span className="kicker">Industries</span>
          <SplitText
            id="who-for"
            className="display h2 mt-4 max-w-[20ch]"
            text="Who we build for"
          />
          <IndustryShowcase />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
