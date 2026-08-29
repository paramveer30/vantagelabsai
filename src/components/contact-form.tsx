"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface-2/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/40";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Something went wrong. Try again.");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="hud relative rounded-xl border border-border bg-surface-2/60 p-6">
        <p className="display font-semibold text-accent">
          Thanks — we got your message.
        </p>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll get back to you within a business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" required className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="company" className="text-sm font-medium">
          Company <span className="text-muted">(optional)</span>
        </label>
        <input id="company" name="company" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          What are you looking to build?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={fieldClass}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
