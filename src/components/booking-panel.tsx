import { BookingEmbed } from "@/components/booking-embed";
import { site } from "@/lib/site";

// The booking URL lives in site.ts. Empty: show a mailto fallback. Set:
// embed the scheduler, with a plain link underneath in case the embed is
// blocked or slow (privacy extensions often block third-party iframes).
export function BookingPanel() {
  if (!site.bookingUrl) {
    return (
      <div className="grid gap-4 rounded-[10px] border border-line bg-black p-6">
        <p className="copy">
          The booking link goes live shortly. Email us or send the form.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="btn btn-primary justify-self-start"
        >
          <span>Email {site.email}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <BookingEmbed url={site.bookingUrl} />
      <p className="copy text-sm">
        Scheduler not loading?{" "}
        <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
          Open the booking page in a new tab
        </a>
        .
      </p>
    </div>
  );
}
