import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteBackground } from "@/components/site-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WelcomeIntro } from "@/components/welcome-intro";
import { site } from "@/lib/site";
import "./globals.css";

// Runs while the HTML is parsing, before anything paints. Marks the
// document as JS-capable (so CSS can keep scroll-reveal content visible
// when JS is absent), then arms the first-load welcome so the page chrome
// is hidden from the first frame. The welcome is skipped where there's no
// particle V to form (reduced motion, narrow viewports); WelcomeIntro
// clears the attributes when the sequence ends.
const welcomeGuard = `(function(){try{var d=document.documentElement;
d.classList.add('js');
if(matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width: 768px)').matches)return;
d.setAttribute('data-welcome','pending');
d.setAttribute('data-welcome-route',location.pathname==='/'?'home':'page');
}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  keywords: [
    "custom software development",
    "web application development",
    "AI integration",
    "automation",
    "software consultancy",
    "MVP development",
    "small business software",
  ],
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/" },
  // og/twitter images come from app/opengraph-image.tsx + twitter-image.tsx.
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#060810",
};

// Organization schema for search engines. Kept in sync with lib/site.ts.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo-mark.png`,
  description: site.description,
  email: site.email,
  contactPoint: {
    "@type": "ContactPoint",
    email: site.email,
    contactType: "customer support",
    availableLanguage: "English",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the welcome guard adds data-welcome[-route]
    // to <html> before hydration.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: welcomeGuard }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteBackground />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WelcomeIntro />
        <CookieConsent />
      </body>
    </html>
  );
}
