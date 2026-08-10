import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  resolveLocalizedValue,
} from "@/lib/i18n";

describe("locale foundation", () => {
  it("launches in English only", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(SUPPORTED_LOCALES).toEqual(["en"]);
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("de")).toBe(false);
  });

  it("falls back from the requested locale to English", () => {
    expect(resolveLocalizedValue({ en: "Tray", de: "Tablett" }, "de", "en")).toBe("Tablett");
    expect(resolveLocalizedValue({ en: "Tray" }, "de", "en")).toBe("Tray");
  });

  it("uses the first non-empty translation as the final fallback", () => {
    expect(resolveLocalizedValue({ en: "", fr: "Plateau" }, "de", "en")).toBe("Plateau");
    expect(resolveLocalizedValue({}, "en", "en")).toBe("");
  });
});
