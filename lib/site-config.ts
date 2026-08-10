export const SITE_CONFIG = {
  brand: "ChuangTe Metal",
  legalName: "Taizhou Chuangte Metal Materials Co., Ltd.",
  displayName: "泰州市创特金属材料有限公司",
  tagline: "Heat-resistant steel castings engineered for extreme conditions.",
  phone: "+86 158 6367 5553",
  email: "info@chuangtecasting.com",
  address: "No. 21 Xiangyuan Road, Shanhuzhen Industrial Cluster, Taixing, Taizhou, Jiangsu, China",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://chuangtecasting.com",
} as const;

export const PRODUCT_SLUGS = [
  "heat-resistant-steel-charge-tray",
  "heat-resistant-steel-charge-rack",
] as const;

export const NAV_ITEMS = [
  { label: "Products", href: "/en/products" },
  { label: "Capabilities", href: "/en/capabilities" },
  { label: "Quality", href: "/en/quality" },
  { label: "Industries", href: "/en/industries" },
  { label: "Factory", href: "/en/factory" },
  { label: "About", href: "/en/about" },
  { label: "News", href: "/en/news" },
  { label: "Contact", href: "/en/contact" },
] as const;

export const PUBLIC_ROUTES = [
  "/en",
  "/en/products",
  "/en/products/heat-resistant-steel-charge-tray",
  "/en/products/heat-resistant-steel-charge-rack",
  "/en/capabilities",
  "/en/quality",
  "/en/industries",
  "/en/factory",
  "/en/about",
  "/en/news",
  "/en/faq",
  "/en/contact",
  "/en/request-a-quote",
] as const;
