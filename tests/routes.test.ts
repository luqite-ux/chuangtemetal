import { describe, expect, it } from "vitest";
import { NAV_ITEMS, PUBLIC_ROUTES, PRODUCT_SLUGS } from "@/lib/site-config";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("public route contract", () => {
  it("exposes every confirmed independent page", () => {
    expect(PUBLIC_ROUTES).toEqual([
      "",
      "/products",
      "/products/heat-resistant-steel-charge-tray",
      "/products/heat-resistant-steel-charge-rack",
      "/capabilities",
      "/custom-process",
      "/quality",
      "/industries",
      "/factory",
      "/about",
      "/news",
      "/faq",
      "/contact",
      "/request-a-quote",
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
      "Quality",
      "Industries",
      "Factory",
      "About",
      "News",
      "Contact",
    ]);
  });

  it("keeps navigation paths locale-neutral", () => {
    expect(NAV_ITEMS.every((item) => !item.href.startsWith("/en"))).toBe(true);
  });

  it("provides an independent custom process page", () => {
    expect(existsSync(join(process.cwd(), "app/[locale]/custom-process/page.tsx"))).toBe(true);
  });

  it("provides the standard proxied tenant administration flow", () => {
    const required = [
      "app/admin/login/page.tsx",
      "app/admin/login/layout.tsx",
      "app/admin/logout/route.ts",
      "app/login/route.ts",
      "app/api/auth/login/route.ts",
      "lib/admin-session.ts",
      "lib/supabase/server.ts",
      "proxy.ts",
    ];
    for (const file of required) expect(existsSync(join(process.cwd(), file))).toBe(true);
    expect(existsSync(join(process.cwd(), "app/admin/page.tsx"))).toBe(false);
    expect(existsSync(join(process.cwd(), "app/api/admin-login/route.ts"))).toBe(false);

    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain("/admin/:path*");
    expect(config).toContain("/api/admin/:path*");

    const compatibilityLogin = readFileSync(join(process.cwd(), "app/login/route.ts"), "utf8");
    expect(compatibilityLogin).toContain('new URL("/admin/login", request.url)');
  });

  it("uses the uploaded customer logo as the only browser icon source", () => {
    expect(existsSync(join(process.cwd(), "app/icon.png"))).toBe(true);
    expect(existsSync(join(process.cwd(), "app/favicon.ico"))).toBe(false);

    const layout = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain('icons: { icon: "/icon.png", apple: "/icon.png" }');
  });
});
