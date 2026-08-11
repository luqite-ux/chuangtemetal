import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles-db";
import { fetchProductsData } from "@/lib/products-db";
import { absoluteUrl } from "@/lib/seo";
import { PUBLIC_ROUTES } from "@/lib/site-config";
import { buildLocalePath } from "@/lib/i18n";
import { getTenantLocaleConfig } from "@/lib/tenant-config";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeConfig = await getTenantLocaleConfig();
  const staticLastModified = new Date("2026-08-10T00:00:00.000Z");
  const staticRoutes = PUBLIC_ROUTES.filter((route) => !route.startsWith("/products/"));
  const entries = await Promise.all(localeConfig.supportedLocales.map(async (locale) => {
    const [articles, products] = await Promise.all([getPublishedArticles(locale), fetchProductsData(locale)]);
    return [
      ...staticRoutes.map((route) => ({ url: absoluteUrl(buildLocalePath(locale, route)), lastModified: staticLastModified, changeFrequency: route.includes("/news") ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })),
      ...products.map((product) => ({ url: absoluteUrl(buildLocalePath(locale, `/products/${product.slug}`)), lastModified: product.updatedAt ? new Date(product.updatedAt) : staticLastModified, changeFrequency: "monthly" as const, priority: .8 })),
      ...articles.map((article) => ({ url: absoluteUrl(buildLocalePath(locale, `/news/${article.slug}`)), lastModified: article.updatedAt || article.publishedAt ? new Date(article.updatedAt || article.publishedAt) : staticLastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ];
  }));
  return entries.flat();
}
