import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";
import type { ProductRecord } from "@/lib/products-fallback";
import type { ArticleRecord } from "@/lib/articles-db";
import { SITE_CONFIG } from "@/lib/site-config";
import type { Metadata } from "next";

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

export function buildPageMetadata(
  title: string,
  description: string,
  pathnameWithoutLocale = "",
  imagePath = "/images/factory/factory-main.png",
  type: "website" | "article" = "website",
): Metadata {
  const suffix = pathnameWithoutLocale ? (pathnameWithoutLocale.startsWith("/") ? pathnameWithoutLocale : `/${pathnameWithoutLocale}`) : "";
  const url = absoluteUrl(`/${DEFAULT_LOCALE}${suffix}`);
  const image = imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: buildAlternates(pathnameWithoutLocale),
    openGraph: { title, description, type, url, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
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

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleJsonLd(article: ArticleRecord, locale: string = DEFAULT_LOCALE) {
  const url = absoluteUrl(`/${locale}/news/${article.slug}`);
  const image = article.featuredImage
    ? (article.featuredImage.startsWith("http") ? article.featuredImage : absoluteUrl(article.featuredImage))
    : absoluteUrl("/images/factory/factory-main.png");
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [image],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: { "@type": "Organization", name: SITE_CONFIG.legalName },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.legalName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png") },
    },
  };
}

export function buildProductMetadata(product: ProductRecord, locale: string = DEFAULT_LOCALE): Metadata {
  const pathname = `/${locale}/products/${product.slug}`;
  const url = absoluteUrl(pathname);
  const image = product.image.startsWith("http") ? product.image : absoluteUrl(product.image);

  return {
    title: product.name,
    description: product.summary,
    alternates: buildAlternates(`/products/${product.slug}`),
    openGraph: {
      title: product.name,
      description: product.summary,
      type: "website",
      url,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.summary,
      images: [image],
    },
  };
}
