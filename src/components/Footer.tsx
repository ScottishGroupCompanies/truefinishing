import Image from "next/image";
import Link from "next/link";
import { BUSINESS, LOGO, SERVICE_LINKS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Image
            src={LOGO.footer}
            alt="True Finishing"
            width={LOGO.footerWidth}
            height={LOGO.footerHeight}
            unoptimized
            className="h-auto w-[100px]"
          />
          <p className="mt-4 text-sm text-grey">
            {BUSINESS.name}
            <br />
            {BUSINESS.street}
            <br />
            {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postal}
          </p>
          <p className="mt-3 text-sm">
            <a href={BUSINESS.phoneHref} className="text-white">
              {BUSINESS.phone}
            </a>
            <br />
            <a href={`mailto:${BUSINESS.email}`} className="text-white">
              {BUSINESS.email}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber">Services</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {SERVICE_LINKS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-white hover:text-amber">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber">Company</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href="/about/" className="text-white hover:text-amber">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="text-white hover:text-amber">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/case-studies/" className="text-white hover:text-amber">
                Case Studies
              </Link>
            </li>
            <li>
              <Link href="/cities-we-serve/" className="text-white hover:text-amber">
                Cities We Serve
              </Link>
            </li>
            <li>
              <Link href="/blog/" className="text-white hover:text-amber">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber">Estimate</h2>
          <p className="mt-3 text-sm text-grey">Tell us about the floor. We reply to the note you send.</p>
          <Link href="/contact/#contact" className="btn mt-4">
            Get a Free Estimate
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1120px] flex-wrap gap-x-4 gap-y-2 px-4 py-4 text-xs text-grey">
          <span>
            © {year} {BUSINESS.name}
          </span>
          <Link href="/privacy-policy/" className="text-grey hover:text-white">
            Privacy Policy
          </Link>
          <a href="/sitemap.xml" className="text-grey hover:text-white">
            Sitemap
          </a>
          <a href="https://viafoci.com" className="text-grey hover:text-white">
            Site design
          </a>
        </div>
      </div>
    </footer>
  );
}
