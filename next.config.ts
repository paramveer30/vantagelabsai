import type { NextConfig } from "next";

// Applied to every response. Vercel terminates TLS and redirects HTTP to
// HTTPS at the edge; the HSTS header below is what actually pins clients to
// HTTPS afterwards. `preload` opts the domain into the browser preload
// lists — safe here because the site is HTTPS-only, but it is a hard
// commitment, so drop it if that ever stops being true.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework.
  poweredByHeader: false,
  images: {
    // Serve modern formats for the work screenshots; falls back automatically.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
