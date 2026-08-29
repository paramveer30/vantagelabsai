import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Panel } from "@/components/ui";
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
        index="05 / 05"
        title="Let's talk about your project"
        subtitle="Book a free discovery call, or send a message and we'll get back to you within a business day."
      />

      <Container className="pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Panel className="flex h-full flex-col">
              <h2 className="display text-xl font-semibold">Book a call</h2>
              {site.calendlyUrl ? (
                <iframe
                  src={site.calendlyUrl}
                  title="Schedule a call with VantageLabsAI"
                  className="mt-4 h-[640px] w-full rounded-xl border border-border"
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
            </Panel>
          </Reveal>

          <Reveal delay={80}>
            <Panel className="flex h-full flex-col">
              <h2 className="display text-xl font-semibold">Send a message</h2>
              <div className="mt-4">
                <ContactForm />
              </div>
            </Panel>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
