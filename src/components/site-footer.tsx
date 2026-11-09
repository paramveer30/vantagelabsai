import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { nav, site } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-inten="0.5" data-cap="0.25">
      <div className="wrap inner">
        <div className="footer-cols">
          <div className="grid content-start gap-3">
            <Link href="/" className="brand">
              <BrandMark size={30} />
              <Wordmark />
            </Link>
            <p className="copy text-sm">{site.tagline}.</p>
          </div>

          <nav aria-labelledby="footer-pages">
            <h2 id="footer-pages" className="footer-heading">
              Pages
            </h2>
            <ul className="footer-list">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-list">
              <li>
                <Link href="/contact">Book a call</Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <p className="m-0">
            &copy; {year} {site.name}
          </p>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms and Conditions</Link>
          </nav>
        </div>

        {/* Decorative sign-off; the company name is already in the text above. */}
        <p className="footer-wordmark" aria-hidden="true">
          <Wordmark />
        </p>
      </div>
    </footer>
  );
}
