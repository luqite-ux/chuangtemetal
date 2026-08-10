import { describe, expect, it } from "vitest";
import { mapProductRow } from "@/lib/products-db";
import { mapArticleRow } from "@/lib/articles-db";

describe("multilingual product mapping", () => {
  it("uses requested JSONB content while preserving the supplied fallback shape", () => {
    const product = mapProductRow({
      slug: "heat-resistant-steel-charge-tray",
      name_i18n: { en: "Custom Tray", de: "Kundenspezifisches Tablett" },
      description_i18n: { en: "English description", de: "Deutsche Beschreibung" },
      image_url: "https://pub-example.r2.dev/tray.png",
      updated_at: "2026-08-10T01:00:00.000Z",
      specs: { Temperature: "800–1100°C" },
    }, "de");
    expect(product.name).toBe("Kundenspezifisches Tablett");
    expect(product.description).toBe("Deutsche Beschreibung");
    expect(product.image).toBe("https://pub-example.r2.dev/tray.png");
    expect(product.gallery[0]).toBe("https://pub-example.r2.dev/tray.png");
    expect(product.updatedAt).toBe("2026-08-10T01:00:00.000Z");
  });

  it("does not invent a rack weight", () => {
    const product = mapProductRow({ slug: "heat-resistant-steel-charge-rack", name_i18n: { en: "Rack" } }, "en");
    expect(product.specifications.some((item) => /weight/i.test(item.label))).toBe(false);
  });
});

describe("multilingual article mapping", () => {
  it("uses the same locale fallback for title, excerpt and content", () => {
    const article = mapArticleRow({
      slug: "thermal-fixture-basics",
      title_i18n: { en: "Thermal Fixture Basics" },
      excerpt_i18n: { en: "A short introduction." },
      content_i18n: { en: "<p>Article body</p>" },
      published_at: "2026-08-10T00:00:00.000Z",
      updated_at: "2026-08-10T01:00:00.000Z",
    }, "de");
    expect(article.title).toBe("Thermal Fixture Basics");
    expect(article.excerpt).toBe("A short introduction.");
    expect(article.content).toContain("Article body");
    expect(article.updatedAt).toBe("2026-08-10T01:00:00.000Z");
  });
});
