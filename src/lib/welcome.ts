"use client";

import { useSyncExternalStore } from "react";

// Shared state for the first-load welcome sequence. Three actors touch it
// from different parts of the tree: WelcomeIntro (the typewriter, in the
// layout), the hero particle cloud (VCloud, on the home page), and the
// head guard script that decides whether the sequence runs at all.
//
//   pending  – nothing has started (server snapshot, and the client until
//              WelcomeIntro mounts)
//   typing   – the greeting is being typed out
//   handoff  – typing is done; the cloud is morphing the letters into the V
//   done     – finished (or skipped/failsafed); everything runs as normal
export type WelcomePhase = "pending" | "typing" | "handoff" | "done";

type State = {
  phase: WelcomePhase;
  // The cloud's Canvas has mounted and rendered a frame (it loads late,
  // ssr: false). WelcomeIntro waits for this before handing off so the
  // implosion never starts against a compile/init stall.
  cloudReady: boolean;
};

const SERVER: State = Object.freeze({
  phase: "pending",
  cloudReady: false,
});

let state: State = {
  phase: "pending",
  cloudReady: false,
};

// Mirror the phase onto <html data-welcome> so CSS can react to it: the
// "pending"/"typing" phases hide the page chrome; on "handoff" the chrome
// is released so it fades in alongside the V; "done" drops the attribute.
function syncAttr() {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (state.phase === "done") {
    el.removeAttribute("data-welcome");
    el.removeAttribute("data-welcome-route");
  } else {
    el.setAttribute("data-welcome", state.phase);
  }
}

// On a full client load the <head> guard has already run, so the
// attribute tells us whether the sequence is armed. Decide once here
// rather than from an effect: useSyncExternalStore reconciles the
// "pending" server snapshot with this on hydration without a mismatch.
if (typeof document !== "undefined") {
  state = {
    ...state,
    phase: document.documentElement.hasAttribute("data-welcome")
      ? "typing"
      : "done",
  };
  syncAttr();
}

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => SERVER;

export function useWelcome(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setPhase(phase: WelcomePhase) {
  if (state.phase !== phase) {
    set({ phase });
    syncAttr();
  }
}

export function setCloudReady() {
  if (!state.cloudReady) set({ cloudReady: true });
}

// Release the page. Idempotent so a click-skip, the failsafe and the
// cloud's own "morph complete" can all call it without fighting.
export function finish() {
  if (state.phase === "done") return;
  set({ phase: "done" });
  syncAttr();
}
