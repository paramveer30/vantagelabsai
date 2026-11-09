"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExampleFrame, type ExampleVariant } from "./example-frame";

// A booking assistant on a dental clinic's site. The conversation
// plays out once when it scrolls into view (typing indicator before each
// assistant reply) and can be replayed. The server render, no-JS and
// reduced-motion all show the full conversation.
const messages = [
  { from: "user", text: "Hi, do you have anything this week for a cleaning?" },
  {
    from: "bot",
    text: "Yes. Dr. Patel has openings on Thursday at 9:40am and 2:15pm, and Friday at 11:00am. Have you been to Harbourview before?",
  },
  { from: "user", text: "No, first time. Do you bill insurance directly?" },
  {
    from: "bot",
    text: "We do, for most insurers. Bring your insurance card to the visit. First visits are 60 minutes so we can do the exam, X-rays and cleaning together. Which time works?",
  },
  { from: "user", text: "Thursday 2:15" },
  {
    from: "bot",
    title: "Held for you: Thu Nov 13, 2:15pm",
    text: "New patient exam and cleaning with Dr. Patel. What email should we send the confirmation and intake form to?",
  },
] as const;

const green = "#0E4D40";

// `full` shows the widget on the clinic's page; `compact` (home page)
// shows just the widget.
export function DentalChat({ variant = "full" }: { variant?: ExampleVariant }) {
  const full = variant === "full";
  // How many messages are shown; null means "all" (the resting state).
  const [shown, setShown] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const timers = useRef<number[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(null);
      return;
    }
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setShown(0);
    setTyping(false);
    let t = 300;
    messages.forEach((m, i) => {
      if (m.from === "bot") {
        timers.current.push(window.setTimeout(() => setTyping(true), t));
        t += 1100;
      }
      timers.current.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, t),
      );
      t += m.from === "bot" ? 900 : 700;
    });
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (!document.documentElement.classList.contains("anim")) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          play();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach(window.clearTimeout);
    };
  }, [play]);

  const count = shown ?? messages.length;

  const widget = (
    <div
      ref={chatRef}
      className={`flex flex-col overflow-hidden rounded-[14px] bg-white ${full ? "mx-4 mb-4 md:absolute md:right-4 md:bottom-4 md:m-0 md:w-[360px]" : "mx-auto w-full max-w-[400px]"}`}
      style={{ boxShadow: "0 12px 40px rgba(14,58,49,.18), 0 0 0 1px #DCE5E1" }}
    >
      <div
        className="flex items-center gap-2.5 px-3.5 py-3 text-white"
        style={{ background: green }}
      >
        <span
          className="grid size-[30px] place-items-center rounded-full text-xs font-bold"
          style={{ background: "#E9F3EF", color: green }}
          aria-hidden="true"
        >
          HD
        </span>
        <div>
          <b>Harbourview booking assistant</b>
          <small className="block text-[11px] opacity-85">
            Usually answers right away
          </small>
        </div>
      </div>
      <div
        className="grid min-h-[380px] content-start gap-2 p-3"
        style={{ background: "#FAFCFB" }}
        aria-live="off"
      >
        {messages.map((m, i) => {
          const visible = i < count;
          return (
            <div
              key={i}
              className={`chat-msg max-w-[84%] rounded-xl px-[11px] py-2 text-[12.5px] leading-[1.45] ${visible ? "" : "is-hidden"}`}
              style={
                m.from === "user"
                  ? {
                      justifySelf: "end",
                      background: green,
                      color: "#fff",
                      borderBottomRightRadius: 4,
                    }
                  : "title" in m
                    ? {
                        justifySelf: "start",
                        background: "#fff",
                        border: "1px solid #CFE0D9",
                        borderBottomLeftRadius: 4,
                      }
                    : {
                        justifySelf: "start",
                        background: "#EAF1EE",
                        borderBottomLeftRadius: 4,
                      }
              }
            >
              {"title" in m ? (
                <b className="block" style={{ color: green }}>
                  {m.title}
                </b>
              ) : null}
              {m.text}
            </div>
          );
        })}
        {typing ? (
          <span className="typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : null}
      </div>
      <div
        className="flex flex-wrap gap-1.5 px-3 pb-2.5"
        style={{ background: "#FAFCFB" }}
      >
        {[
          "Change the time",
          "Parking and directions",
          "Talk to the front desk",
        ].map((c) => (
          <span
            key={c}
            className="rounded-full border px-2.5 py-1 text-[11.5px]"
            style={{ borderColor: "#A9C7BC", color: green }}
          >
            {c}
          </span>
        ))}
      </div>
      <div
        className="flex items-center gap-2 border-t px-3 py-2.5 text-[12.5px]"
        style={{ borderColor: "#E1E8E5", color: "#4F655F" }}
      >
        <span className="flex-1">Type your email…</span>
        <span
          className="inline-block size-7 rounded-full"
          style={{ background: green }}
          aria-hidden="true"
        />
      </div>
    </div>
  );

  return (
    <ExampleFrame
      title={
        full
          ? "Booking assistant on a dental clinic's website"
          : "Booking chatbot for a dental clinic"
      }
      variant={variant}
      action={
        <button type="button" className="replay" onClick={play}>
          Replay conversation
        </button>
      }
    >
      {full ? (
        <div
          className="relative overflow-hidden text-[13px] md:min-h-[640px]"
          style={{ background: "#F6F8F7", color: "#18302A" }}
        >
          <div
            className="flex items-center justify-between gap-3 border-b bg-white px-[22px] py-3.5"
            style={{ borderColor: "#E1E8E5" }}
          >
            <span className="font-serif text-xl" style={{ color: green }}>
              Harbourview Dental
            </span>
            <ul
              className="m-0 hidden list-none gap-[18px] p-0 md:flex"
              style={{ color: "#3D5650" }}
            >
              <li>Treatments</li>
              <li>Our team</li>
              <li>New patients</li>
              <li>Insurance</li>
            </ul>
            <span
              className="rounded-md px-3 py-2 text-xs font-semibold whitespace-nowrap text-white"
              style={{ background: green }}
            >
              Book online
            </span>
          </div>
          <div className="max-w-[470px] px-[22px] py-6 md:py-10">
            <p
              className="m-0 mb-2.5 font-serif text-[28px] leading-[1.08] md:text-[34px]"
              style={{ color: "#0E3A31" }}
            >
              Family dentistry, with evening and Saturday hours
            </p>
            <p className="m-0 mb-3.5" style={{ color: "#3D5650" }}>
              Check-ups, cleanings, fillings and emergency visits for the whole
              family.
            </p>
            <ul
              className="m-0 grid list-none gap-1.5 p-0"
              style={{ color: "#3D5650" }}
            >
              <li>Direct billing to most insurers</li>
              <li>New patients welcome</li>
              <li>Open until 8pm Tue and Thu</li>
            </ul>
          </div>
          {widget}
        </div>
      ) : (
        <div
          className="p-4 text-[13px] sm:p-8"
          style={{ background: "#F6F8F7", color: "#18302A" }}
        >
          {widget}
        </div>
      )}
    </ExampleFrame>
  );
}
