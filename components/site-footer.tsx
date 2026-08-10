import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/site-config";
import { BrandLockup } from "@/components/brand-lockup";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <BrandLockup footer />
          <p>{SITE_CONFIG.tagline}</p>
        </div>
        <div>
          <h2>Explore</h2>
          <div className="footer-links">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h2>Contact</h2>
          <div className="footer-contact">
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}><Phone size={17} />{SITE_CONFIG.phone}</a>
            <a href={`mailto:${SITE_CONFIG.email}`}><Mail size={17} />{SITE_CONFIG.email}</a>
            <span><MapPin size={17} />{SITE_CONFIG.address}</span>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} ChuangTe Metal. All rights reserved.</span>
        <Link href="/en/contact">Talk to our team</Link>
      </div>
    </footer>
  );
}
