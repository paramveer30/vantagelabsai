import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { POST } from "./route";

const SECRET = "whsec_test";

const bookingCreated = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    title: "30 min meeting",
    startTime: "2026-09-05T15:00:00Z",
    endTime: "2026-09-05T15:30:00Z",
    uid: "abc123",
    location: "Cal Video",
    additionalNotes: "Looking to scope a booking tool",
    attendees: [
      { name: "Jordan Lee", email: "jordan@example.com", timeZone: "America/Toronto" },
    ],
  },
};

function post(body: unknown, { raw, signature }: { raw?: string; signature?: string } = {}) {
  const payload = raw ?? JSON.stringify(body);
  const sig =
    signature ?? createHmac("sha256", SECRET).update(payload).digest("hex");
  return POST(
    new Request("http://localhost/api/cal/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-cal-signature-256": sig,
      },
      body: payload,
    }),
  );
}

beforeEach(() => {
  mockSend.mockReset();
  mockSend.mockResolvedValue({ data: { id: "email_1" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "test_key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "hello@vantagelabsai.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@vantagelabsai.com");
  vi.stubEnv("CAL_WEBHOOK_SECRET", SECRET);
});

describe("POST /api/cal/webhook", () => {
  it("emails the team for a valid, signed BOOKING_CREATED event", async () => {
    const res = await post(bookingCreated);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0]).toMatchObject({
      to: "inbox@vantagelabsai.com",
      replyTo: "jordan@example.com",
    });
    expect(mockSend.mock.calls[0][0].subject).toContain("Jordan Lee");
    expect(mockSend.mock.calls[0][0].text).toContain("jordan@example.com");
  });

  it("returns 401 and does not send when the signature is wrong", async () => {
    const res = await post(bookingCreated, { signature: "deadbeef" });

    expect(res.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await post(null, { raw: "{ broken" });

    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("acknowledges but ignores an unhandled trigger event", async () => {
    const res = await post({ triggerEvent: "MEETING_ENDED", payload: {} });

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("logs instead of sending when RESEND_API_KEY is unset", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const res = await post(bookingCreated);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("skips signature verification when no secret is configured", async () => {
    vi.stubEnv("CAL_WEBHOOK_SECRET", "");

    const res = await post(bookingCreated, { signature: "not-checked" });

    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("rejects an unsigned request with 500 in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CAL_WEBHOOK_SECRET", "");

    const res = await post(bookingCreated, { signature: "not-checked" });

    expect(res.status).toBe(500);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("fails with 500 in production when email is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "");

    const res = await post(bookingCreated);

    expect(res.status).toBe(500);
    expect(mockSend).not.toHaveBeenCalled();
  });
});
