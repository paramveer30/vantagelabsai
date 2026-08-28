import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free discovery call or send us a message about your project.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        subtitle="Book a free discovery call, or send a message and we'll get back to you within a business day."
      />

      <Container className="grid gap-12 pb-24 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Book a call</h2>
          {site.calendlyUrl ? (
            <iframe
              src={site.calendlyUrl}
              title="Schedule a call with VantageLabsAI"
              className="mt-4 h-[640px] w-full rounded-2xl border border-border"
            />
          ) : (
            <p className="mt-4 text-sm text-muted">
              Our booking link is going live shortly. In the meantime, send a
              message and we&apos;ll set up a time — or email us directly at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-accent hover:underline"
              >
                {site.email}
              </a>
              .
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
