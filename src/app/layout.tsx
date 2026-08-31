import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { SiteBackground } from "@/components/site-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WelcomeIntro } from "@/components/welcome-intro";
import { site } from "@/lib/site";
import "./globals.css";

// Runs while the HTML is parsing, before anything paints: arm the
// first-load welcome so the page chrome is hidden from the first frame.
// Skipped where there's no particle V to form (reduced motion, narrow
// viewports); WelcomeIntro clears the attributes when the sequence ends.
const welcomeGuard = `(function(){try{var d=document.documentElement;
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    images: [{ url: "/brand/social-card.png", width: 1240, height: 535 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    images: ["/brand/social-card.png"],
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
        <SiteBackground />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WelcomeIntro />
      </body>
    </html>
  );
}
