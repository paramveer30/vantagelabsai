"use client";

import { useEffect, useRef, useState } from "react";
import { ExampleFrame } from "./example-frame";

// A property manager: invoices arriving by email become checked
// records. On reveal each row flips from "Reading PDF…" to its result and
// the pipeline step lights up; the resting state is the finished table.
const inbox = [
  {
    from: "Brightline Electrical",
    when: "8:12am",
    subject: "Invoice 10482 for Unit 4B rewiring.pdf",
    unread: true,
  },
  {
    from: "Cedar Plumbing",
    when: "7:50am",
    subject: "INV-2231 (corrected copy).pdf",
    unread: true,
  },
  {
    from: "Northgate Supply",
    when: "Mon",
    subject: "Statement Oct + 3 invoices.zip",
    unread: true,
  },
  {
    from: "Lakeview Landscaping",
    when: "Mon",
    subject: "Re: Re: invoice for October?",
    unread: false,
  },
  {
    from: "Cedar Plumbing",
    when: "Fri",
    subject: "INV-2231.pdf",
    unread: false,
  },
];

const rows = [
  {
    vendor: "Brightline Electrical",
    sub: "Unit 4B, 220 Elm",
    inv: "10482",
    wo: "WO-881",
    due: "Dec 5",
    amount: "$2,340.00",
    status: ["blue", "Awaiting approval"],
  },
  {
    vendor: "Cedar Plumbing",
    sub: "Corrected copy",
    inv: "INV-2231",
    wo: "WO-874",
    due: "Nov 28",
    amount: "$615.40",
    status: ["warn", "Replaces earlier copy"],
  },
  {
    vendor: "Northgate Supply",
    sub: "From Oct statement",
    inv: "NS-7710",
    wo: "WO-869",
    due: "Nov 30",
    amount: "$184.12",
    status: ["ok", "Matched"],
  },
  {
    vendor: "Northgate Supply",
    sub: "From Oct statement",
    inv: "NS-7714",
    wo: "None found",
    due: "Nov 30",
    amount: "$96.50",
    status: ["bad", "No work order"],
  },
  {
    vendor: "Lakeview Landscaping",
    sub: "Body text, no PDF",
    inv: "LL-0193",
    wo: "WO-850",
    due: "Nov 20",
    amount: "$1,120.00",
    status: ["ok", "Approved by Maria"],
  },
] as const;

const steps = [
  "Email arrives",
  "Fields extracted",
  "Matched to work order",
  "Sent for approval",
];
const STEP_MS = 750;

export function InvoiceIntake() {
  // Rows resolved so far; null = all resolved (resting state).
  const [done, setDone] = useState<number | null>(null);
  const [flash, setFlash] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (!document.documentElement.classList.contains("anim")) return;
    const timers: number[] = [];
    // Arm (rows back to "Reading PDF…") while the table is still below the
    // fold, then play once it's actually on screen.
    const arm = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        arm.disconnect();
        setDone(0);
      },
      { rootMargin: "0px 0px 60% 0px" },
    );
    arm.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        arm.disconnect();
        setDone((d) => d ?? 0);
        rows.forEach((_, i) => {
          timers.push(
            window.setTimeout(
              () => {
                setDone(i + 1);
                setFlash(i);
              },
              500 + i * STEP_MS,
            ),
          );
        });
        timers.push(
          window.setTimeout(
            () => setFlash(-1),
            500 + rows.length * STEP_MS + 400,
          ),
        );
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      arm.disconnect();
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const resolved = done ?? rows.length;
  const activeStep = flash >= 0 ? flash % steps.length : -1;

  return (
    <ExampleFrame title="Invoice intake automation for a property manager">
      <div ref={ref} className="grid text-[12.5px] lg:grid-cols-[4fr_7fr]">
        <div className="min-w-0 border-b border-line bg-black p-6 lg:border-r lg:border-b-0">
          <p className="mt-0 mb-3 font-mono text-xs tracking-[0.08em] text-muted uppercase">
            Before: the shared inbox
          </p>
          <ul className="m-0 grid list-none overflow-hidden rounded-[10px] border border-line p-0">
            {inbox.map((m, i) => (
              <li
                key={i}
                className="grid grid-cols-[1fr_auto] gap-x-2.5 gap-y-0.5 border-b border-line px-3 py-2.5 last:border-b-0"
              >
                <b className="font-semibold">
                  {m.unread ? (
                    <>
                      <span
                        className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Unread: </span>
                    </>
                  ) : null}
                  {m.from}
                </b>
                <span className="font-mono text-[11px] text-muted">
                  {m.when}
                </span>
                <span className="text-[11.5px] text-muted">{m.subject}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 mb-0 text-muted">
            Someone opens each PDF, retypes it into a spreadsheet, checks it
            against the work order, then chases approval by email.
          </p>
        </div>

        <div className="min-w-0 p-6">
          <p className="mt-0 mb-3 font-mono text-xs tracking-[0.08em] text-muted uppercase">
            After: every invoice becomes a checked record
          </p>
          <ol className="m-0 mb-4 flex list-none flex-wrap items-center gap-1.5 p-0 text-xs">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span
                  className="rounded-md border px-2.5 py-1 transition-colors duration-300"
                  style={
                    i === activeStep
                      ? {
                          borderColor: "var(--accent)",
                          color: "var(--accent)",
                          background: "var(--s3)",
                        }
                      : {
                          borderColor: "var(--line-strong)",
                          background: "var(--s3)",
                        }
                  }
                >
                  {s}
                </span>
                {i < steps.length - 1 ? (
                  <span className="text-accent" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Invoice</th>
                  <th>Work order</th>
                  <th>Due</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.inv} className={flash === i ? "flash" : undefined}>
                    <td>
                      {r.vendor}
                      <span className="sub">{r.sub}</span>
                    </td>
                    <td className="id">{r.inv}</td>
                    <td className="id">{r.wo}</td>
                    <td>{r.due}</td>
                    <td className="num">{r.amount}</td>
                    <td>
                      {i < resolved ? (
                        <span className={`pill ${r.status[0]}`}>
                          {r.status[1]}
                        </span>
                      ) : (
                        <span className="pill reading">Reading PDF…</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ExampleFrame>
  );
}
