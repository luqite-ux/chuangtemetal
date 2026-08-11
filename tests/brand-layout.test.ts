import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BrandLockup } from "@/components/brand-lockup";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

describe("brand lockup layout", () => {
  it("keeps the uploaded logo mark inside a fixed navigation height", () => {
    const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
    expect(css).toMatch(/\.brand-mark\s*\{[^}]*width:\s*54px;[^}]*height:\s*54px;/s);
    expect(css).not.toMatch(/\.brand-link img\s*\{[^}]*height:\s*auto;/s);
  });

  it("renders the transparent CT mark in the header lockup", () => {
    const markup = renderToStaticMarkup(createElement(BrandLockup));
    expect(markup).toContain("mark-transparent.png");
    const png = readFileSync(path.join(process.cwd(), "public", "brand", "mark-transparent.png"));
    expect(png[25]).toBe(6);
  });

  it("uses the WCAG-safe dark orange for white primary button text", () => {
    const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
    expect(css).toMatch(/\.button-primary\s*\{[^}]*background:\s*var\(--orange-dark\)/s);
  });
});
