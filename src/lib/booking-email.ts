// Email body for the Cal.com booking webhook. Kept pure so it can be unit
// tested and so route.ts stays focused on signature checks and transport.

export type BookingEvent = {
  // Cal.com triggerEvent, e.g. "BOOKING_CREATED".
  triggerEvent: string;
  title: string;
  // ISO strings straight from the Cal.com payload.
  startTime: string;
  endTime: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimeZone?: string;
  location?: string;
  notes?: string;
  uid: string;
};

const HEADINGS: Record<string, string> = {
  BOOKING_CREATED: "New booking",
  BOOKING_RESCHEDULED: "Booking rescheduled",
  BOOKING_CANCELLED: "Booking cancelled",
};

function formatWhen(startTime: string, endTime: string, timeZone?: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime())) {
    return `${startTime} – ${endTime}`;
  }

  const tz = timeZone || "UTC";
  try {
    const date = new Intl.DateTimeFormat("en-CA", {
      dateStyle: "full",
      timeZone: tz,
    }).format(start);
    const time = new Intl.DateTimeFormat("en-CA", {
      timeStyle: "short",
      timeZone: tz,
    });
    const endText = Number.isNaN(end.getTime()) ? "" : `–${time.format(end)}`;
    return `${date}, ${time.format(start)}${endText} (${tz})`;
  } catch {
    // Bad timezone string from the payload; fall back to the raw ISO.
    return `${startTime} – ${endTime}`;
  }
}

export function buildBookingNotification(event: BookingEvent): {
  subject: string;
  text: string;
} {
  const heading = HEADINGS[event.triggerEvent] ?? "Booking update";
  const when = formatWhen(
    event.startTime,
    event.endTime,
    event.attendeeTimeZone,
  );

  return {
    subject: `${heading}: ${event.attendeeName}, ${event.title}`,
    text: [
      `${heading} via Cal.com.`,
      "",
      `Name: ${event.attendeeName}`,
      `Email: ${event.attendeeEmail || "not provided"}`,
      `When: ${when}`,
      event.location ? `Location: ${event.location}` : null,
      event.notes ? `Notes: ${event.notes}` : null,
      event.uid ? `Booking ref: ${event.uid}` : null,
      "",
      `Raw start: ${event.startTime}`,
    ]
      .filter((line): line is string => line !== null)
      .join("\n"),
  };
}
