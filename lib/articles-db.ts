import { resolveLocalizedValue } from "@/lib/i18n";
import { getServerSupabase, tenantId } from "@/lib/supabase";

export type ArticleRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
};

export function mapArticleRow(row: Record<string, unknown>, locale = "en"): ArticleRecord {
  return {
    slug: String(row.slug || ""),
    title: resolveLocalizedValue(row.title_i18n as Record<string, string>, locale),
    excerpt: resolveLocalizedValue(row.excerpt_i18n as Record<string, string>, locale),
    content: resolveLocalizedValue(row.content_i18n as Record<string, string>, locale),
    featuredImage: String(row.featured_image || ""),
    publishedAt: String(row.published_at || row.created_at || ""),
    updatedAt: String(row.updated_at || row.published_at || row.created_at || ""),
  };
}

export async function getPublishedArticles(locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return [];
  const { data, error } = await client.from("articles").select("*").eq("tenant_id", tenantId).eq("is_published", true).order("published_at", { ascending: false });
  return error ? [] : (data ?? []).map((row) => mapArticleRow(row, locale));
}

export async function getArticleBySlug(slug: string, locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return null;
  const { data, error } = await client.from("articles").select("*").eq("tenant_id", tenantId).eq("slug", slug).eq("is_published", true).maybeSingle();
  return error || !data ? null : mapArticleRow(data, locale);
}
