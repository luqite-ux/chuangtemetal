import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  resolveLocalizedValue,
  replacePathLocale,
  extractLocaleFromPathname,
} from "@/lib/i18n";
import { normalizeTenantLocaleConfig } from "@/lib/tenant-config";

describe("locale foundation", () => {
  it("launches in English only", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(SUPPORTED_LOCALES).toEqual(["en"]);
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("de")).toBe(false);
  });

  it("accepts a language enabled by the tenant without changing the route code", () => {
    expect(isSupportedLocale("de", ["en", "de"])).toBe(true);
    expect(isSupportedLocale("fr", ["en", "de"])).toBe(false);
  });

  it("preserves the current page when the language switcher changes locale", () => {
    expect(replacePathLocale("/en/products/heat-resistant-steel-charge-tray?ref=nav", "de"))
      .toBe("/de/products/heat-resistant-steel-charge-tray?ref=nav");
    expect(replacePathLocale("/en", "de")).toBe("/de");
  });

  it("falls back from the requested locale to English", () => {
    expect(resolveLocalizedValue({ en: "Tray", de: "Tablett" }, "de", "en")).toBe("Tablett");
    expect(resolveLocalizedValue({ en: "Tray" }, "de", "en")).toBe("Tray");
  });

  it("uses the first non-empty translation as the final fallback", () => {
    expect(resolveLocalizedValue({ en: "", fr: "Plateau" }, "de", "en")).toBe("Plateau");
    expect(resolveLocalizedValue({}, "en", "en")).toBe("");
  });

  it("normalizes a non-English tenant default and keeps it enabled", () => {
    expect(normalizeTenantLocaleConfig({
      default_language: "zh",
      supported_languages: ["en", "zh", "ZH", "invalid_locale"],
    })).toEqual({ defaultLocale: "zh", supportedLocales: ["zh", "en"] });
  });

  it("derives the HTML language from a locale route and falls back for non-locale routes", () => {
    expect(extractLocaleFromPathname("/de/products", "en")).toBe("de");
    expect(extractLocaleFromPathname("/admin/login", "en")).toBe("en");
    expect(extractLocaleFromPathname("/", "zh")).toBe("zh");
  });
});
