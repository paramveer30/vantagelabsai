import { BookingEmbed } from "@/components/booking-embed";
import { site } from "@/lib/site";

// The booking URL lives in site.ts. Empty → show a mailto fallback card;
// set it to a Calendly/Cal.com embed URL to swap in the scheduler.
export function BookingPanel() {
  if (!site.bookingUrl) {
    return (
      <div className="hud card-glow relative flex h-full min-h-[420px] flex-col justify-center rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">
          Booking link goes live shortly — email us or send the form.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-4 inline-block self-start rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
        >
          Email {site.email}
        </a>
      </div>
    );
  }

  return <BookingEmbed url={site.bookingUrl} />;
}
