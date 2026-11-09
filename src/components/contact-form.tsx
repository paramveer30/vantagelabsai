"use client";

import { useRef, useState } from "react";
import { isValidBudget } from "@/lib/budget";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message" | "budget";
type Errors = Partial<Record<Field, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<string, string>): Errors {
  const errors: Errors = {};
  if (!data.name?.trim()) errors.name = "Enter your name.";
  if (!data.email?.trim()) errors.email = "Enter your email address.";
  else if (!emailRe.test(data.email.trim()))
    errors.email = "Enter an email address like name@example.com.";
  if (!data.message?.trim())
    errors.message = "Tell us a little about what you need built.";
  if (data.budget?.trim() && !isValidBudget(data.budget))
    errors.budget = "Enter a number, like 10000.";
  return errors;
}

// Name, email, message, and an optional budget. Every field has a visible
// label; errors are linked with aria-describedby and the first invalid
// field receives focus on submit. Fully keyboard operable: no custom
// widgets; the budget is an optional free number.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  // After the first submit, re-check as fields change so a fixed field
  // clears its error without another submit.
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
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const data = currentData();
      if (!data.budget?.trim()) delete data.budget;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error ?? "The message didn't send. Try again, or email us.",
        );
      }

      form.reset();
      submitted.current = false;
      setErrors({});
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "The message didn't send. Try again, or email us.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="grid min-h-[280px] place-content-center gap-3 text-center"
        role="status"
      >
        <p className="display text-2xl">Thanks, we got your message.</p>
        <p className="copy mx-auto max-w-xs">
          We&apos;ll get back to you within a business day.
        </p>
      </div>
    );
  }

  const describedBy = (field: Field) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={revalidate}
      noValidate
      className="grid gap-5"
    >
      {/* Honeypot: hidden from people, filled in by bots. The API drops
          anything with this set. */}
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
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
          {errors.name && (
            <p id="name-error" className="error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
          {errors.email && (
            <p id="email-error" className="error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">What do you want built?</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="For example: a booking system for our clinic, or a way to stop retyping invoices."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
        />
        {errors.message && (
          <p id="message-error" className="error">
            {errors.message}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="budget">
          Budget <span className="optional">(optional)</span>
        </label>
        <input
          id="budget"
          name="budget"
          inputMode="decimal"
          autoComplete="off"
          placeholder="10000"
          aria-invalid={errors.budget ? true : undefined}
          aria-describedby={
            errors.budget ? "budget-hint budget-error" : "budget-hint"
          }
        />
        <p id="budget-hint" className="hint m-0">
          A rough number is fine. Leave it blank if you&apos;re not sure yet.
        </p>
        {errors.budget && (
          <p id="budget-error" className="error">
            {errors.budget}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="m-0 text-sm text-bad" role="alert">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="btn btn-primary"
        >
          <span>{status === "submitting" ? "Sending…" : "Send message"}</span>
        </button>
      </div>
    </form>
  );
}
