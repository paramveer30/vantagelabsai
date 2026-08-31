"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Hit } from "./three/types";

type Vec = { x: number; y: number };
type Box = { x0: number; y0: number; x1: number; y1: number };

const SCALE = 1.7;
const FOOT = 14 * SCALE; // torso centre → feet
const CR = 12 * SCALE; // containment radius
const GRAVITY = 640; // px/s², gentle; the cursor leash does the work
const LEASH_K = 155;
const LEASH_C = 23;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A small cursor-driven mech that lives on the formed monitor: it trails
// the pointer, is contained by the bezel, and rattles the particle field
// when it slams an edge.
export function ParkourFigure({
  active,
  hitRef,
}: {
  active: boolean;
  hitRef?: RefObject<Hit>;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    let interior: Box = { x0: 0, y0: 0, x1: 0, y1: 0 };
    const rebuild = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cx = 0.5 * W;
      const cy = 0.428 * H;
      const hw = 0.467 * H;
      const hh = 0.286 * H;
      const bez = 0.022 * H;
      interior = {
        x0: cx - hw + bez,
        y0: cy - hh + bez,
        x1: cx + hw - bez,
        y1: cy + hh - bez,
      };
    };
    rebuild();
    window.addEventListener("resize", rebuild);

    const cursor: Vec = {
      x: (interior.x0 + interior.x1) / 2,
      y: (interior.y0 + interior.y1) / 2,
    };
    const onMove = (e: PointerEvent) => {
      const lr = layer.getBoundingClientRect();
      cursor.x = e.clientX - lr.left;
      cursor.y = e.clientY - lr.top;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const pos: Vec = { x: cursor.x, y: cursor.y };
    const vel: Vec = { x: 0, y: 0 };
    let grounded = false;
    let facing = 1;
    let lean = 0;
    let stride = 0;
    let airBlend = 1;
    let sqH = 0;
    let sqHv = 0;
    let sqV = 0;
    let sqVv = 0;
    let cdBorder = 0;

    let last = performance.now();
    let raf = 0;
    const limbEls = figRef.current
      ? Array.from(figRef.current.querySelectorAll<SVGGElement>(".limb"))
      : [];

    const step = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;

      // leash toward the cursor, plus a little weight
      vel.x += ((cursor.x - pos.x) * LEASH_K - vel.x * LEASH_C) * dt;
      vel.y +=
        ((cursor.y - pos.y) * LEASH_K - vel.y * LEASH_C + GRAVITY) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      // monitor border: contain, never enter the bezel
      grounded = false;
      let bx = 0;
      let by = 0;
      if (pos.x - CR < interior.x0) {
        pos.x = interior.x0 + CR;
        bx = 1;
      } else if (pos.x + CR > interior.x1) {
        pos.x = interior.x1 - CR;
        bx = -1;
      }
      if (pos.y - CR < interior.y0) {
        pos.y = interior.y0 + CR;
        by = 1;
      } else if (pos.y + CR > interior.y1) {
        pos.y = interior.y1 - CR;
        by = -1;
        grounded = true;
      }
      if (bx || by) {
        let impact = 0;
        if (bx && vel.x * bx < 0) {
          impact = Math.abs(vel.x);
          vel.x = -vel.x * 0.3;
        }
        if (by && vel.y * by < 0) {
          impact = Math.max(impact, Math.abs(vel.y));
          vel.y = -vel.y * 0.3;
        }
        if (impact > 130 && now > cdBorder) {
          cdBorder = now + 160;
          const px = bx > 0 ? interior.x0 : bx < 0 ? interior.x1 : pos.x;
          const py = by > 0 ? interior.y0 : by < 0 ? interior.y1 : pos.y;
          if (hitRef?.current) {
            hitRef.current = {
              x: px,
              y: py,
              t: now,
              power: clamp(impact / 900, 0.35, 1),
            };
          }
          if (bx) sqH = Math.min(0.7, sqH + 0.3 + impact / 3000);
          if (by) sqV = Math.min(0.7, sqV + 0.3 + impact / 3000);
        }
      }

      // --- cosmetics ------------------------------------------------
      const fgoal =
        Math.abs(vel.x) > 24 ? (vel.x > 0 ? 1 : -1) : cursor.x > pos.x ? 1 : -1;
      facing += (fgoal - facing) * damp(14, dt);
      lean += (clamp(vel.x / 900, -1, 1) * 0.22 - lean) * damp(10, dt);
      airBlend += ((grounded ? 0 : 1) - airBlend) * damp(12, dt);
      if (grounded) stride += (Math.abs(vel.x) * dt) / 19;

      sqHv += (-165 * sqH - 20 * sqHv) * dt;
      sqH += sqHv * dt;
      sqVv += (-165 * sqV - 20 * sqVv) * dt;
      sqV += sqVv * dt;
      const dfx = 1 + sqH * 0.9 - sqV * 0.7;
      const dfy = 1 + sqV * 0.9 - sqH * 0.7;

      const fig = figRef.current;
      if (fig) {
        fig.style.transform =
          `translate(${pos.x - 12}px, ${pos.y - 16}px) ` +
          `rotate(${lean}rad) scale(${dfx * facing * SCALE}, ${dfy * SCALE})`;
      }

      // contact shadow on the monitor floor
      const feetY = pos.y + FOOT;
      const gsh = clamp(1 - Math.max(0, interior.y1 - feetY) / 240, 0.12, 1);
      const sh = shadowRef.current;
      if (sh) {
        sh.style.transform =
          `translate(${pos.x - 16}px, ${interior.y1 - 4}px) ` +
          `scale(${1.2 * gsh}, ${gsh})`;
        sh.style.opacity = `${0.4 * gsh}`;
      }

      // limbs: run cycle blended toward an airborne pose. Arms stay a low
      // outward sway even mid-move; a big raise swings the hands up across
      // the torso and reads as a glitch.
      if (limbEls.length === 4) {
        const s = Math.sin(stride) * 34;
        const o = Math.sin(stride + Math.PI) * 34;
        const set = (el: SVGGElement, run: number, air: number) => {
          el.style.transform = `rotate(${mix(run, air, airBlend)}deg)`;
        };
        set(limbEls[0], s * 0.6, -22);
        set(limbEls[1], o * 0.6, 22);
        set(limbEls[2], (o / 34) * 40, 12);
        set(limbEls[3], (s / 34) * 40, -16);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active, hitRef]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.4s" }}
    >
      <div ref={shadowRef} className="pk-shadow absolute left-0 top-0" />
      <div ref={figRef} className="pk absolute left-0 top-0">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {/* antenna */}
          <line x1="12" y1="2.2" x2="12" y2="0.9" strokeWidth="1.3" />
          <circle cx="12" cy="0.7" r="0.95" fill="currentColor" stroke="none" />
          {/* head: clean rounded chassis with a visor and two eyes */}
          <rect x="7.4" y="2.2" width="9.2" height="7.2" rx="2.1" strokeWidth="1.7" />
          <rect x="9" y="4.2" width="6" height="2.7" rx="1.35" fill="currentColor" stroke="none" opacity="0.22" />
          <circle cx="10.5" cy="5.55" r="0.72" fill="currentColor" stroke="none" />
          <circle cx="13.5" cy="5.55" r="0.72" fill="currentColor" stroke="none" />
          {/* neck */}
          <line x1="12" y1="9.4" x2="12" y2="10.6" strokeWidth="1.4" />
          {/* torso + reactor core + panel seam + hip block */}
          <rect x="8" y="10.5" width="8" height="9.1" rx="1.7" strokeWidth="1.7" />
          <circle className="pk-core" cx="12" cy="14" r="1.85" fill="currentColor" stroke="none" />
          <line x1="9.6" y1="17" x2="14.4" y2="17" strokeWidth="1" opacity="0.45" />
          <rect x="8.6" y="19" width="6.8" height="2.1" rx="0.9" fill="currentColor" stroke="none" opacity="0.9" />
          {/* limbs: panelled arms then legs; each group's bbox top-centre
              sits on its shoulder / hip so the CSS pivot lands right */}
          <g className="limb">
            <rect x="6.5" y="11" width="2" height="7.1" rx="1" />
            <circle cx="7.5" cy="18.4" r="1.15" fill="currentColor" stroke="none" />
          </g>
          <g className="limb">
            <rect x="15.5" y="11" width="2" height="7.1" rx="1" />
            <circle cx="16.5" cy="18.4" r="1.15" fill="currentColor" stroke="none" />
          </g>
          <g className="limb">
            <rect x="9" y="20.2" width="2.1" height="7.4" rx="1" />
            <rect x="8.1" y="27.4" width="3.9" height="1.9" rx="0.7" fill="currentColor" stroke="none" />
          </g>
          <g className="limb">
            <rect x="12.9" y="20.2" width="2.1" height="7.4" rx="1" />
            <rect x="12" y="27.4" width="3.9" height="1.9" rx="0.7" fill="currentColor" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}
