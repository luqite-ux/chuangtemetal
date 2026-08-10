import { describe, expect, it } from "vitest";
import { NAV_ITEMS, PUBLIC_ROUTES, PRODUCT_SLUGS } from "@/lib/site-config";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("public route contract", () => {
  it("exposes every confirmed independent page", () => {
    expect(PUBLIC_ROUTES).toEqual([
      "/en",
      "/en/products",
      "/en/products/heat-resistant-steel-charge-tray",
      "/en/products/heat-resistant-steel-charge-rack",
      "/en/capabilities",
      "/en/industries",
      "/en/factory",
      "/en/about",
      "/en/news",
      "/en/faq",
      "/en/contact",
      "/en/request-a-quote",
    ]);
  });

  it("launches with exactly two supplied products", () => {
    expect(PRODUCT_SLUGS).toEqual([
      "heat-resistant-steel-charge-tray",
      "heat-resistant-steel-charge-rack",
    ]);
  });

  it("uses the confirmed primary navigation", () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Products",
      "Capabilities",
      "Industries",
      "Factory",
      "About",
      "News",
      "Contact",
    ]);
  });

  it("provides the tenant administration login handoff", () => {
    expect(existsSync(join(process.cwd(), "app/admin/page.tsx"))).toBe(true);
    expect(existsSync(join(process.cwd(), "app/api/admin-login/route.ts"))).toBe(true);
  });
});
