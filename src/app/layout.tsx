import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Fraunces,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollEffects } from "@/components/scroll-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TextureBackground } from "@/components/texture-background";
import { site } from "@/lib/site";
import "./globals.css";

// Runs before first paint. `anim` arms the entrance styles (words held
// below their line, chart bars at zero); without JS, or under reduced
// motion, it is never set and everything renders in its finished state.
const motionGuard = `(function(){try{var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('anim');}catch(e){}})();`;

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand face for a few of the client-style product screens in the
// "Who we build for" switcher (a grocer, a vet, an accounting firm).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
  themeColor: "#02070A",
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
    // suppressHydrationWarning: the motion guard adds classes to <html>
    // before hydration.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} ${instrument.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main"
          className="btn btn-primary btn-sm fixed top-2 left-2 z-[70] -translate-y-24 focus:translate-y-0"
        >
          <span>Skip to content</span>
        </a>
        <TextureBackground />
        <ScrollEffects />
        <div className="site-layer flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
