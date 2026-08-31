"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-brand focus:ring-2 focus:ring-brand/30";
const labelClass = "text-sm font-medium text-foreground";

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
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 bg-accent/10 text-lg text-accent"
        >
          ✓
        </span>
        <p className="font-semibold">Thanks, we got your message.</p>
        <p className="max-w-xs text-sm text-muted">
          We&apos;ll get back to you within a business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
      {/* Honeypot: hidden from people, catnip for bots. Submitted with the
          rest of the form; the API drops anything with this filled in. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>
          Company <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="Acme Inc."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <label htmlFor="message" className={labelClass}>
          What are you looking to build?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="A booking system, an internal tool, an AI assistant…"
          className={`${fieldClass} flex-1 resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
