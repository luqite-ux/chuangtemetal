import { describe, expect, it } from "vitest";
import { absoluteUrl, buildAlternates, buildProductJsonLd } from "@/lib/seo";
import { FALLBACK_PRODUCTS } from "@/lib/products-fallback";

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
});
