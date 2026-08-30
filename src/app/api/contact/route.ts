import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(2000),
  // Honeypot: hidden in the form, so a value here means a bot filled it.
  website: z.string().max(100).optional(),
});

const genericError = "Something went wrong. Please email us instead.";

// Fixed-window per-IP limit. The Map lives in module memory, so this is a
// stopgap only — it resets on every serverless cold start and each running
// instance keeps its own count. Move to a shared store before it matters.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Try again in a little while." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const { name, email, company, message, website } = parsed.data;

  // Honeypot tripped — accept the request so the bot moves on, drop the message.
  if (website && website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "contact: email not configured — set RESEND_API_KEY to send notifications",
    );
    console.info("contact submission", { name, email });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "",
      to: process.env.CONTACT_TO_EMAIL ?? "",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : null,
        "",
        message,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("contact: Resend returned an error", error);
      return NextResponse.json({ error: genericError }, { status: 502 });
    }
  } catch (err) {
    console.error("contact: failed to send notification email", err);
    return NextResponse.json({ error: genericError }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
