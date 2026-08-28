import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
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

  // TODO: dispatch notification email via Resend once RESEND_API_KEY is set.
  console.info("contact submission", {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  return NextResponse.json({ ok: true });
}
