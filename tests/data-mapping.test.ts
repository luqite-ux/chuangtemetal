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

  it("maps advantages_i18n with the same requested-language fallback", () => {
    const product = mapProductRow({
      slug: "heat-resistant-steel-charge-tray",
      advantages_i18n: {
        en: ["Drawing-based engineering"],
        de: ["Zeichnungsbasierte Konstruktion"],
      },
    }, "de");
    expect(product.advantages).toEqual(["Zeichnungsbasierte Konstruktion"]);
  });

  it("uses the tenant default language before the first available translation", () => {
    const product = mapProductRow({
      slug: "heat-resistant-steel-charge-tray",
      name_i18n: { en: "English tray", zh: "中文料盘" },
      description_i18n: { en: "English description", zh: "中文说明" },
      features_i18n: { en: ["English feature"], zh: ["中文特点"] },
    }, "de", "zh");
    expect(product.name).toBe("中文料盘");
    expect(product.summary).toBe("中文说明");
    expect(product.features).toEqual(["中文特点"]);
  });

  it("skips empty requested list values before using the tenant default", () => {
    const product = mapProductRow({
      slug: "heat-resistant-steel-charge-tray",
      features_i18n: { de: [], zh: ["中文特点"] },
      advantages_i18n: { de: "   ", zh: ["中文优势"] },
    }, "de", "zh");
    expect(product.features).toEqual(["中文特点"]);
    expect(product.advantages).toEqual(["中文优势"]);
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

  it("removes executable markup from stored article HTML", () => {
    const article = mapArticleRow({
      slug: "safe-article",
      title_i18n: { en: "Safe article" },
      excerpt_i18n: { en: "Safe excerpt" },
      content_i18n: {
        en: '<h2>Useful heading</h2><script>alert(1)</script><p onclick="alert(2)">Body <a href="javascript:alert(3)">link</a></p>',
      },
    }, "en");
    expect(article.content).toContain("<h2>Useful heading</h2>");
    expect(article.content).toContain("<p>Body");
    expect(article.content).not.toMatch(/script|onclick|javascript:/i);
  });

  it("uses a non-English tenant default for article fields", () => {
    const article = mapArticleRow({
      slug: "localized-article",
      title_i18n: { en: "English title", zh: "中文标题" },
      excerpt_i18n: { en: "English excerpt", zh: "中文摘要" },
      content_i18n: { en: "<p>English</p>", zh: "<p>中文正文</p>" },
    }, "de", "zh");
    expect(article.title).toBe("中文标题");
    expect(article.excerpt).toBe("中文摘要");
    expect(article.content).toBe("<p>中文正文</p>");
  });
});
