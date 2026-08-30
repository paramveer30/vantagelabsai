import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { POST } from "./route";

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "We need a scheduling tool for our workshop.",
};

function post(
  body: unknown,
  { ip = "10.0.0.1", raw }: { ip?: string; raw?: string } = {},
) {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: raw ?? JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  mockSend.mockReset();
  mockSend.mockResolvedValue({ data: { id: "email_1" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "test_key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "hello@vantagelabsai.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "inbox@vantagelabsai.com");
});

describe("POST /api/contact", () => {
  it("sends an email and returns ok for a valid submission", async () => {
    const res = await post(validBody, { ip: "10.1.0.1" });

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0]).toMatchObject({
      to: "inbox@vantagelabsai.com",
      replyTo: "ada@example.com",
    });
  });

  it("returns 422 when the body fails validation", async () => {
    const res = await post(
      { name: "Ada", email: "not-an-email", message: "" },
      { ip: "10.2.0.1" },
    );

    expect(res.status).toBe(422);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await post(null, { ip: "10.3.0.1", raw: "{ broken" });

    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("accepts but drops a submission with the honeypot filled", async () => {
    const res = await post(
      { ...validBody, website: "http://spam.example" },
      { ip: "10.4.0.1" },
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 429 once the per-IP window is exceeded", async () => {
    const ip = "10.5.0.1";
    for (let i = 0; i < 5; i++) {
      expect((await post(validBody, { ip })).status).toBe(200);
    }

    const res = await post(validBody, { ip });
    expect(res.status).toBe(429);
  });
});
