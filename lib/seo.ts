import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";
import type { ProductRecord } from "@/lib/products-fallback";
import { SITE_CONFIG } from "@/lib/site-config";

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${SITE_CONFIG.siteUrl.replace(/\/$/, "")}/`).toString().replace(/\/$/, pathname === "/" ? "/" : "");
}

export function buildAlternates(pathnameWithoutLocale = "") {
  const normalized = pathnameWithoutLocale.startsWith("/") ? pathnameWithoutLocale : `/${pathnameWithoutLocale}`;
  const languages = Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, absoluteUrl(`/${locale}${normalized}`)]));
  return {
    canonical: absoluteUrl(`/${DEFAULT_LOCALE}${normalized}`),
    languages: { ...languages, "x-default": absoluteUrl(`/${DEFAULT_LOCALE}${normalized}`) },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.brand,
    url: absoluteUrl("/en"),
    logo: absoluteUrl("/brand/logo.png"),
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    address: { "@type": "PostalAddress", streetAddress: SITE_CONFIG.address, addressCountry: "CN" },
  };
}

export function buildProductJsonLd(product: ProductRecord, locale: string = DEFAULT_LOCALE) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.gallery.map((image) => absoluteUrl(image)),
    url: absoluteUrl(`/${locale}/products/${product.slug}`),
    brand: { "@type": "Brand", name: SITE_CONFIG.brand },
    manufacturer: { "@type": "Organization", name: SITE_CONFIG.legalName },
  };
}
