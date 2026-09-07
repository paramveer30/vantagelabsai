"use client";

import { useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const fieldClass =
  "mt-1.5 w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:ring-2 focus:ring-brand/30";
const labelClass = "text-sm font-medium text-foreground";

// Border colour swaps to danger once a field has an error.
function inputClass(hasError: boolean) {
  return `${fieldClass} ${
    hasError
      ? "border-danger focus:border-danger"
      : "border-border focus:border-brand"
  }`;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<string, string>): Errors {
  const errors: Errors = {};
  if (!data.name?.trim()) errors.name = "Please enter your name.";
  if (!data.email?.trim()) errors.email = "Please enter your email address.";
  else if (!emailRe.test(data.email.trim()))
    errors.email = "That doesn't look like a valid email address.";
  if (!data.message?.trim())
    errors.message = "Tell us a little about what you need.";
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  // Once the form has been submitted once, re-check fields as they change
  // so a corrected field clears its error without another submit.
  const submitted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function currentData() {
    return Object.fromEntries(
      new FormData(formRef.current ?? undefined),
    ) as Record<string, string>;
  }

  function revalidate() {
    if (submitted.current) setErrors(validate(currentData()));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    submitted.current = true;

    const found = validate(currentData());
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

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
      submitted.current = false;
      setErrors({});
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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={revalidate}
      noValidate
      className="flex h-full flex-col gap-4"
    >
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
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 text-xs text-danger">
              {errors.name}
            </p>
          )}
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
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1.5 text-xs text-danger"
            >
              {errors.email}
            </p>
          )}
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
          className={inputClass(false)}
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
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClass(!!errors.message)} flex-1 resize-y`}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-1.5 text-xs text-danger"
          >
            {errors.message}
          </p>
        )}
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
