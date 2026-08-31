import type { Metadata } from "next";
import { BookingPanel } from "@/components/booking-panel";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free discovery call or send us a message about your project.",
};

// Two matched routes to the same conversation; the numbers key the panel
// headers to the "what to expect" strip below.
const panels = [
  {
    n: "01",
    title: "Book a call",
    note: "Pick a slot that suits you. It lands straight on our calendar.",
  },
  {
    n: "02",
    title: "Send a message",
    note: "Tell us what you're building and we'll come back with next steps.",
  },
] as const;

const expectations = [
  {
    title: "A 30-minute call",
    body: "We learn what you're building, the constraints, and where software fits.",
  },
  {
    title: "No pitch, no obligation",
    body: "You leave with a clear read on scope and next steps, even if it isn't us.",
  },
  {
    title: "A reply within a business day",
    body: "Messages reach the founders directly, so you hear back fast.",
  },
] as const;

function PanelHeader({
  n,
  title,
  note,
}: {
  n: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-accent">{n}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="display mt-3 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        subtitle="Book a free discovery call, or send a message and we'll get back to you within a business day."
      />

      <Container className="pb-16">
        <div className="grid items-stretch gap-x-8 gap-y-10 lg:grid-cols-2">
          <Reveal index={0} className="h-full">
            <div className="flex h-full flex-col">
              <PanelHeader {...panels[0]} />
              <div className="mt-6 flex flex-1 flex-col">
                <BookingPanel />
              </div>
            </div>
          </Reveal>

          <Reveal index={1} className="h-full">
            <div className="flex h-full flex-col">
              <PanelHeader {...panels[1]} />
              <div className="hud card-glow relative mt-6 flex flex-1 flex-col rounded-2xl border border-border bg-surface p-6 md:p-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      <Container className="pb-24">
        <Reveal index={2}>
          <div className="grid gap-4 sm:grid-cols-3">
            {expectations.map((item, i) => (
              <div
                key={item.title}
                className="hud relative h-full rounded-2xl border border-border bg-surface/60 p-6"
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Prefer email? Reach us at{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-accent transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </>
  );
}
