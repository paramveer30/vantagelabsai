import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import { Resend } from "resend";

import { buildBookingNotification, type BookingEvent } from "@/lib/booking-email";

// Cal.com POSTs here whenever a booking changes. It signs the raw body with the
// webhook's shared secret (HMAC-SHA256, hex) in the `x-cal-signature-256`
// header. We verify that, then email the team. Mirrors /api/contact: a missing
// RESEND_API_KEY logs instead of failing so the endpoint still works in dev.

const HANDLED = new Set([
  "BOOKING_CREATED",
  "BOOKING_RESCHEDULED",
  "BOOKING_CANCELLED",
]);

const genericError = "Could not process the booking webhook.";

function signatureMatches(raw: string, secret: string, provided: string) {
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

type CalAttendee = { name?: string; email?: string; timeZone?: string };
type CalPayload = {
  title?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  additionalNotes?: string;
  uid?: string;
  attendees?: CalAttendee[];
  responses?: Record<string, { value?: string } | undefined>;
};

export async function POST(req: Request) {
  // Raw text, not req.json() — the signature is over the exact bytes sent.
  const raw = await req.text();

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("x-cal-signature-256") ?? "";
    if (!signatureMatches(raw, secret, provided)) {
      console.warn("cal webhook: signature mismatch");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } else {
    console.warn(
      "cal webhook: CAL_WEBHOOK_SECRET not set — skipping signature check",
    );
  }

  let body: { triggerEvent?: string; payload?: CalPayload };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const triggerEvent = body.triggerEvent ?? "";
  if (!HANDLED.has(triggerEvent)) {
    // Acknowledge unknown events so Cal.com doesn't retry them.
    return NextResponse.json({ ok: true });
  }

  const payload = body.payload ?? {};
  const attendee = payload.attendees?.[0] ?? {};
  const event: BookingEvent = {
    triggerEvent,
    title: payload.title ?? "Booking",
    startTime: payload.startTime ?? "",
    endTime: payload.endTime ?? "",
    attendeeName:
      attendee.name ?? payload.responses?.name?.value ?? "Someone",
    attendeeEmail: attendee.email ?? payload.responses?.email?.value ?? "",
    attendeeTimeZone: attendee.timeZone,
    location: payload.location,
    notes: payload.additionalNotes ?? payload.responses?.notes?.value,
    uid: payload.uid ?? "",
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "cal webhook: email not configured — set RESEND_API_KEY to send notifications",
    );
    console.info("cal booking", event);
    return NextResponse.json({ ok: true });
  }

  const { subject, text } = buildBookingNotification(event);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "",
      to: process.env.CONTACT_TO_EMAIL ?? "",
      replyTo: event.attendeeEmail || undefined,
      subject,
      text,
    });

    if (error) {
      console.error("cal webhook: Resend returned an error", error, event);
      return NextResponse.json({ error: genericError }, { status: 502 });
    }
  } catch (err) {
    console.error("cal webhook: failed to send notification email", err, event);
    return NextResponse.json({ error: genericError }, { status: 502 });
  }

  console.info("cal webhook: booking notification sent", {
    triggerEvent,
    uid: event.uid,
  });

  return NextResponse.json({ ok: true });
}
