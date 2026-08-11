import { DEFAULT_LOCALE, resolveLocalizedValue } from "@/lib/i18n";
import { FALLBACK_PRODUCTS, getFallbackProduct, type ProductRecord } from "@/lib/products-fallback";
import { getServerSupabase, tenantId } from "@/lib/supabase";
import { getTenantLocaleConfig } from "@/lib/tenant-config";

type DbProduct = Record<string, unknown> & {
  slug: string;
  name_i18n?: Record<string, string>;
  description_i18n?: Record<string, string>;
  overview_i18n?: Record<string, string>;
  features_i18n?: Record<string, string[] | string>;
  advantages_i18n?: Record<string, string[] | string>;
  applications_i18n?: Record<string, string[] | string>;
  image_url?: string;
  specs?: Record<string, unknown>;
  extra_data?: { images?: string[] };
  updated_at?: string;
};

function localizedList(values: Record<string, string[] | string> | undefined, locale: string, defaultLocale: string, fallback: string[]) {
  const candidates = [values?.[locale], values?.[defaultLocale], ...Object.values(values ?? {})];
  for (const value of candidates) {
    const items = Array.isArray(value)
      ? value.map((item) => item.trim()).filter(Boolean)
      : typeof value === "string"
        ? value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean)
        : [];
    if (items.length > 0) return items;
  }
  return fallback;
}

export function mapProductRow(row: DbProduct, locale: string = DEFAULT_LOCALE, defaultLocale: string = DEFAULT_LOCALE): ProductRecord {
  const fallback = getFallbackProduct(row.slug);
  if (!fallback) {
    return {
      slug: row.slug,
      name: resolveLocalizedValue(row.name_i18n, locale, defaultLocale) || row.slug,
      eyebrow: "Custom heat-resistant casting",
      summary: resolveLocalizedValue(row.description_i18n, locale, defaultLocale),
      description: resolveLocalizedValue(row.overview_i18n, locale, defaultLocale) || resolveLocalizedValue(row.description_i18n, locale, defaultLocale),
      image: row.image_url || "/images/products/charge-tray-01.png",
      gallery: row.extra_data?.images?.filter(Boolean) || (row.image_url ? [row.image_url] : []),
      specifications: Object.entries(row.specs || {}).map(([label, value]) => ({ label, value: String(value) })),
      features: localizedList(row.features_i18n, locale, defaultLocale, []),
      advantages: localizedList(row.advantages_i18n, locale, defaultLocale, []),
      applications: localizedList(row.applications_i18n, locale, defaultLocale, []),
      updatedAt: row.updated_at,
    };
  }
  const image = row.image_url || fallback.image;
  const gallery = [image, ...(row.extra_data?.images || [])].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index);
  const mappedSpecs = Object.entries(row.specs || {}).map(([label, value]) => ({ label, value: String(value) }));
  return {
    ...fallback,
    name: resolveLocalizedValue(row.name_i18n, locale, defaultLocale) || fallback.name,
    summary: resolveLocalizedValue(row.description_i18n, locale, defaultLocale) || fallback.summary,
    description: resolveLocalizedValue(row.overview_i18n, locale, defaultLocale) || resolveLocalizedValue(row.description_i18n, locale, defaultLocale) || fallback.description,
    image,
    gallery,
    specifications: mappedSpecs.length > 0 ? mappedSpecs : fallback.specifications,
    features: localizedList(row.features_i18n, locale, defaultLocale, fallback.features),
    advantages: localizedList(row.advantages_i18n, locale, defaultLocale, fallback.advantages),
    applications: localizedList(row.applications_i18n, locale, defaultLocale, fallback.applications),
    updatedAt: row.updated_at || fallback.updatedAt,
  };
}

export async function fetchProductsData(locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return FALLBACK_PRODUCTS;
  const { data, error } = await client.from("products").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("sort_order");
  if (error) {
    console.error("Unable to load active products", { code: error.code });
    return FALLBACK_PRODUCTS;
  }
  const { defaultLocale } = await getTenantLocaleConfig();
  return (data ?? []).map((row) => mapProductRow(row as DbProduct, locale, defaultLocale));
}

export async function getProductBySlug(slug: string, locale = "en") {
  const client = getServerSupabase();
  if (!client || !tenantId) return getFallbackProduct(slug);
  const { data, error } = await client.from("products").select("*").eq("tenant_id", tenantId).eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error) {
    console.error("Unable to load active product", { code: error.code, slug });
    return getFallbackProduct(slug);
  }
  if (!data) return null;
  const { defaultLocale } = await getTenantLocaleConfig();
  return mapProductRow(data as DbProduct, locale, defaultLocale);
}
