import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("brand lockup layout", () => {
  it("keeps the uploaded logo mark inside a fixed navigation height", () => {
    const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
    expect(css).toMatch(/\.brand-mark\s*\{[^}]*width:\s*54px;[^}]*height:\s*54px;/s);
    expect(css).not.toMatch(/\.brand-link img\s*\{[^}]*height:\s*auto;/s);
  });

  it("uses the WCAG-safe dark orange for white primary button text", () => {
    const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
    expect(css).toMatch(/\.button-primary\s*\{[^}]*background:\s*var\(--orange-dark\)/s);
  });
});
