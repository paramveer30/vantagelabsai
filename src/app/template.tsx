import { ViewTransition } from "react";

// Wraps the routed page so every navigation crossfades instead of
// snapping. templates remount on each navigation (layouts don't), so the
// exit/enter pair actually fires here. The header and starfield are
// pinned by name in globals.css so only the page body fades.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  );
}
