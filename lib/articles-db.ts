import { resolveLocalizedValue } from "@/lib/i18n";
import { getServerSupabase, tenantId } from "@/lib/supabase";
import { sanitizeArticleHtml } from "@/lib/sanitize-article-html";
import { getTenantLocaleConfig } from "@/lib/tenant-config";

export type ArticleRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
};

export function mapArticleRow(row: Record<string, unknown>, locale = "en", defaultLocale = "en"): ArticleRecord {
  return {
    slug: String(row.slug || ""),
    title: resolveLocalizedValue(row.title_i18n as Record<string, string>, locale, defaultLocale),
    excerpt: resolveLocalizedValue(row.excerpt_i18n as Record<string, string>, locale, defaultLocale),
    content: sanitizeArticleHtml(resolveLocalizedValue(row.content_i18n as Record<string, string>, locale, defaultLocale)),
    featuredImage: String(row.featured_image || ""),
    publishedAt: String(row.published_at || row.created_at || ""),
    updatedAt: String(row.updated_at || row.published_at || row.created_at || ""),
  };
}

export async function getPublishedArticles(locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return [];
  const { data, error } = await client.from("articles").select("*").eq("tenant_id", tenantId).eq("is_published", true).order("published_at", { ascending: false });
  if (error) return [];
  const { defaultLocale } = await getTenantLocaleConfig();
  return (data ?? []).map((row) => mapArticleRow(row, locale, defaultLocale));
}

export async function getArticleBySlug(slug: string, locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return null;
  const { data, error } = await client.from("articles").select("*").eq("tenant_id", tenantId).eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error || !data) return null;
  const { defaultLocale } = await getTenantLocaleConfig();
  return mapArticleRow(data, locale, defaultLocale);
}
