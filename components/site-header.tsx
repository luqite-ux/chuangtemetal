"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/site-config";
import { BrandLockup } from "@/components/brand-lockup";
import { buildLocalePath, DEFAULT_LOCALE, replacePathLocale } from "@/lib/i18n";

export function SiteHeader({ currentLocale, supportedLocales }: { currentLocale?: string; supportedLocales?: string[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = currentLocale || pathname.split("/").filter(Boolean)[0] || DEFAULT_LOCALE;
  const languageLinks = (supportedLocales ?? [locale]).filter((item, index, items) => items.indexOf(item) === index);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href={buildLocalePath(locale)} className="brand-link" aria-label="ChuangTe Metal home">
          <BrandLockup />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const href = buildLocalePath(locale, item.href);
            return (
            <Link key={item.href} href={href} className={pathname === href ? "active" : ""}>
              {item.label}
            </Link>
          );})}
        </nav>
        {languageLinks.length > 1 && <nav className="language-switcher" aria-label="Language switcher">
          {languageLinks.map((language) => <Link key={language} href={replacePathLocale(pathname, language)} hrefLang={language} aria-current={language === locale ? "page" : undefined}>{language.toUpperCase()}</Link>)}
        </nav>}
        <Link href={buildLocalePath(locale, "/request-a-quote")} className="button button-primary header-cta">
          Request a Quote
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={buildLocalePath(locale, item.href)} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {languageLinks.length > 1 && <div className="mobile-languages" aria-label="Language switcher">
            {languageLinks.map((language) => <Link key={language} href={replacePathLocale(pathname, language)} hrefLang={language} onClick={() => setOpen(false)}>{language.toUpperCase()}</Link>)}
          </div>}
          <Link href={buildLocalePath(locale, "/request-a-quote")} className="button button-primary" onClick={() => setOpen(false)}>
            Request a Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
