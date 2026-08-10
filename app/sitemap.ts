import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles-db";
import { absoluteUrl } from "@/lib/seo";
import { PUBLIC_ROUTES } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles("en");
  const now = new Date();
  return [
    ...PUBLIC_ROUTES.map((route) => ({ url: absoluteUrl(route), lastModified: now, changeFrequency: route.includes("/news") ? "weekly" as const : "monthly" as const, priority: route === "/en" ? 1 : route.includes("/products/") ? .8 : .7 })),
    ...articles.map((article) => ({ url: absoluteUrl(`/en/news/${article.slug}`), lastModified: article.publishedAt ? new Date(article.publishedAt) : now, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
