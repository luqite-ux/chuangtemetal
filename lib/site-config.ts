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
  { label: "Products", href: "/products" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Quality", href: "/quality" },
  { label: "Industries", href: "/industries" },
  { label: "Factory", href: "/factory" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export const PUBLIC_ROUTES = [
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
] as const;
