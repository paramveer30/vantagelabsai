"use client";

import { useCallback, useSyncExternalStore } from "react";

// Resolves during the first client render (not in an effect), so the
// animated branches don't mount once and then swap out on mobile.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

const noopSubscribe = () => () => {};

// False during SSR and the first client render, true once hydrated. Lets a
// component render a server-safe branch and swap to a client-only one
// without a hydration mismatch.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
