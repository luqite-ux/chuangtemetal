import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles-db";
import { fetchProductsData } from "@/lib/products-db";
import { absoluteUrl } from "@/lib/seo";
import { PUBLIC_ROUTES } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, products] = await Promise.all([getPublishedArticles("en"), fetchProductsData("en")]);
  const staticLastModified = new Date("2026-08-10T00:00:00.000Z");
  const staticRoutes = PUBLIC_ROUTES.filter((route) => !route.startsWith("/en/products/"));
  return [
    ...staticRoutes.map((route) => ({ url: absoluteUrl(route), lastModified: staticLastModified, changeFrequency: route.includes("/news") ? "weekly" as const : "monthly" as const, priority: route === "/en" ? 1 : .7 })),
    ...products.map((product) => ({ url: absoluteUrl(`/en/products/${product.slug}`), lastModified: product.updatedAt ? new Date(product.updatedAt) : staticLastModified, changeFrequency: "monthly" as const, priority: .8 })),
    ...articles.map((article) => ({ url: absoluteUrl(`/en/news/${article.slug}`), lastModified: article.updatedAt || article.publishedAt ? new Date(article.updatedAt || article.publishedAt) : staticLastModified, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
