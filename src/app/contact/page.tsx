import type { Metadata } from "next";
import { BookingPanel } from "@/components/booking-panel";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";

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
          <BookingPanel />
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
