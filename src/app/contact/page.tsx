import { BookingPanel } from "@/components/booking-panel";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Book a free discovery call or send us a message about your project.",
  path: "/contact",
});

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

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Let's talk about your"
        accent="project"
        subtitle="Book a free discovery call, or send a message and we'll get back to you within a business day."
      />

      <div className="wrap" data-inten="0.75" data-cap="0.3">
        <div className="grid gap-12 pb-24 lg:grid-cols-2 lg:gap-16">
          <section className="panel" aria-labelledby="book-title">
            <h2 id="book-title" className="panel-title">
              Book a 30-minute call
            </h2>
            <p className="copy">
              Pick a slot that suits you. It lands straight on our calendar.
            </p>
            <BookingPanel />
            <ul className="expect-list">
              {expectations.map((item) => (
                <li key={item.title}>
                  <b>{item.title}</b>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel" aria-labelledby="message-title">
            <h2 id="message-title" className="panel-title">
              Send a message
            </h2>
            <ContactForm />
            <p className="copy text-sm">
              Prefer email? Reach us at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
