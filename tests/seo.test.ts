import { describe, expect, it } from "vitest";
import { absoluteUrl, buildAlternates, buildProductJsonLd, buildProductMetadata } from "@/lib/seo";
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

  it("builds product schema from the supplied product record", () => {
    const schema = buildProductJsonLd(FALLBACK_PRODUCTS[0], "en");
    expect(schema["@type"]).toBe("Product");
    expect(schema.name).toBe("Heat-Resistant Steel Charge Tray");
    expect(schema.url).toContain("/en/products/heat-resistant-steel-charge-tray");
  });

  it("builds complete product sharing metadata", () => {
    const metadata = buildProductMetadata(FALLBACK_PRODUCTS[0], "en");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "https://chuangtecasting.com/en/products/heat-resistant-steel-charge-tray",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("keeps administration and API routes out of search results", () => {
    const rules = robots().rules;
    expect(rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/auth/", "/preview/"],
    });
  });
});
