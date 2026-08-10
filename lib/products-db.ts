import { resolveLocalizedValue } from "@/lib/i18n";
import { FALLBACK_PRODUCTS, getFallbackProduct, type ProductRecord } from "@/lib/products-fallback";
import { getServerSupabase, tenantId } from "@/lib/supabase";

type DbProduct = Record<string, unknown> & {
  slug: string;
  name_i18n?: Record<string, string>;
  description_i18n?: Record<string, string>;
  overview_i18n?: Record<string, string>;
  features_i18n?: Record<string, string[] | string>;
  applications_i18n?: Record<string, string[] | string>;
  image_url?: string;
  specs?: Record<string, unknown>;
  extra_data?: { images?: string[] };
};

function localizedList(values: Record<string, string[] | string> | undefined, locale: string, fallback: string[]) {
  const value = values?.[locale] ?? values?.en ?? Object.values(values ?? {}).find(Boolean);
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
  return fallback;
}

export function mapProductRow(row: DbProduct, locale = "en"): ProductRecord {
  const fallback = getFallbackProduct(row.slug);
  if (!fallback) {
    return {
      slug: row.slug,
      name: resolveLocalizedValue(row.name_i18n, locale) || row.slug,
      eyebrow: "Custom heat-resistant casting",
      summary: resolveLocalizedValue(row.description_i18n, locale),
      description: resolveLocalizedValue(row.overview_i18n, locale) || resolveLocalizedValue(row.description_i18n, locale),
      image: row.image_url || "/images/products/charge-tray-01.png",
      gallery: row.extra_data?.images?.filter(Boolean) || (row.image_url ? [row.image_url] : []),
      specifications: Object.entries(row.specs || {}).map(([label, value]) => ({ label, value: String(value) })),
      features: localizedList(row.features_i18n, locale, []),
      applications: localizedList(row.applications_i18n, locale, []),
    };
  }
  const image = row.image_url || fallback.image;
  const gallery = [image, ...(row.extra_data?.images || [])].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index);
  const mappedSpecs = Object.entries(row.specs || {}).map(([label, value]) => ({ label, value: String(value) }));
  return {
    ...fallback,
    name: resolveLocalizedValue(row.name_i18n, locale) || fallback.name,
    summary: resolveLocalizedValue(row.description_i18n, locale) || fallback.summary,
    description: resolveLocalizedValue(row.overview_i18n, locale) || resolveLocalizedValue(row.description_i18n, locale) || fallback.description,
    image,
    gallery,
    specifications: mappedSpecs.length > 0 ? mappedSpecs : fallback.specifications,
    features: localizedList(row.features_i18n, locale, fallback.features),
    applications: localizedList(row.applications_i18n, locale, fallback.applications),
  };
}

export async function fetchProductsData(locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return FALLBACK_PRODUCTS;
  const { data, error } = await client.from("products").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("sort_order");
  if (error || !data?.length) return FALLBACK_PRODUCTS;
  return data.map((row) => mapProductRow(row as DbProduct, locale));
}

export async function getProductBySlug(slug: string, locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return getFallbackProduct(slug);
  const { data, error } = await client.from("products").select("*").eq("tenant_id", tenantId).eq("slug", slug).eq("is_active", true).maybeSingle();
  return error || !data ? getFallbackProduct(slug) : mapProductRow(data as DbProduct, locale);
}
