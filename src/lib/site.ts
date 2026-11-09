export const site = {
  name: "VantageLabsAI",
  tagline: "Custom software for any business that needs it",
  description:
    "VantageLabsAI builds custom software, AI integrations, and ongoing support for businesses of any size, from local shops to technical founders.",
  // The live address. Everything that names the site (canonical URLs,
  // sitemap, social cards, legal pages) reads from here, so switching to
  // a custom domain later is a change to these two lines.
  domain: "vantagelabs.vercel.app",
  url: "https://vantagelabs.vercel.app",
  email: "vantage.labs@outlook.ca",
  // Paste a Cal.com (cal.com/your-handle/intro) or Calendly
  // (calendly.com/your-handle/30min) link here. Empty → the contact page
  // shows a mailto fallback card; the embed adds dark-theme params.
  bookingUrl: "https://cal.com/vantagelabs/30min",
} as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
] as const;
