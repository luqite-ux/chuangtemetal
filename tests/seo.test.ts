import { describe, expect, it } from "vitest";
import { absoluteUrl, buildAlternates, buildArticleJsonLd, buildBreadcrumbJsonLd, buildPageMetadata, buildProductJsonLd, buildProductMetadata, serializeJsonLd } from "@/lib/seo";
import { FALLBACK_PRODUCTS } from "@/lib/products-fallback";
import robots from "@/app/robots";

describe("technical SEO helpers", () => {
  it("uses the confirmed formal HTTPS domain", () => {
    expect(absoluteUrl("/en/products")).toBe("https://chuangtecasting.com/en/products");
  });

  it("emits only enabled locale alternates plus x-default", () => {
    expect(buildAlternates("/products")).toEqual({
      canonical: "https://chuangtecasting.com/en/products",
      languages: {
        en: "https://chuangtecasting.com/en/products",
        "x-default": "https://chuangtecasting.com/en/products",
      },
    });
  });

  it("emits reciprocal alternates for every tenant-enabled locale", () => {
    expect(buildAlternates("/products", "de", ["en", "de"])).toEqual({
      canonical: "https://chuangtecasting.com/de/products",
      languages: {
        en: "https://chuangtecasting.com/en/products",
        de: "https://chuangtecasting.com/de/products",
        "x-default": "https://chuangtecasting.com/en/products",
      },
    });
  });

  it("builds product schema from the supplied product record", () => {
    const schema = buildProductJsonLd(FALLBACK_PRODUCTS[0], "en");
    expect(schema["@type"]).toBe("Product");
    expect(schema.name).toBe("Heat-Resistant Steel Charge Tray");
    expect(schema.url).toContain("/en/products/heat-resistant-steel-charge-tray");
  });

  it("builds article and breadcrumb schema for dynamic news pages", () => {
    const article = buildArticleJsonLd({
      slug: "process-note",
      title: "Process note",
      excerpt: "A verified process note.",
      content: "<p>Body</p>",
      featuredImage: "",
      publishedAt: "2026-08-10T00:00:00.000Z",
      updatedAt: "2026-08-10T01:00:00.000Z",
    }, "en");
    expect(article).toMatchObject({
      "@type": "NewsArticle",
      headline: "Process note",
      datePublished: "2026-08-10T00:00:00.000Z",
      dateModified: "2026-08-10T01:00:00.000Z",
    });

    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Home", path: "/en" },
      { name: "News", path: "/en/news" },
      { name: "Process note", path: "/en/news/process-note" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);
  });

  it("builds complete product sharing metadata", () => {
    const metadata = buildProductMetadata(FALLBACK_PRODUCTS[0], "en");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "https://chuangtecasting.com/en/products/heat-resistant-steel-charge-tray",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("uses the canonical page URL in Open Graph metadata", () => {
    const metadata = buildPageMetadata("Factory", "Factory description", "/factory");
    expect(metadata.alternates).toMatchObject({ canonical: "https://chuangtecasting.com/en/factory" });
    expect(metadata.openGraph).toMatchObject({ url: "https://chuangtecasting.com/en/factory" });
  });

  it("keeps administration and API routes out of search results", () => {
    const rules = robots().rules;
    expect(rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/auth/", "/preview/"],
    });
  });

  it("serializes database content without allowing a closing script tag", () => {
    const serialized = serializeJsonLd({ name: '</script><script>alert("xss")</script>' });
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script>");
    expect(JSON.parse(serialized).name).toBe('</script><script>alert("xss")</script>');
  });
});
