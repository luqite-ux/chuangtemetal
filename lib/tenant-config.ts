import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n";
import { getServerSupabase, tenantId } from "@/lib/supabase";
import { cache } from "react";

export type TenantLocaleConfig = {
  defaultLocale: string;
  supportedLocales: string[];
};

const localePattern = /^[a-z]{2}(?:-[a-z]{2})?$/;

export function normalizeTenantLocaleConfig(value: {
  default_language?: unknown;
  supported_languages?: unknown;
} | null | undefined): TenantLocaleConfig {
  const candidateDefault = typeof value?.default_language === "string" ? value.default_language.trim().toLowerCase() : "";
  const defaultLocale = localePattern.test(candidateDefault) ? candidateDefault : DEFAULT_LOCALE;
  const candidates = Array.isArray(value?.supported_languages) ? value.supported_languages : SUPPORTED_LOCALES;
  const supportedLocales = Array.from(new Set(
    [defaultLocale, ...candidates]
      .filter((locale): locale is string => typeof locale === "string")
      .map((locale) => locale.trim().toLowerCase())
      .filter((locale) => localePattern.test(locale)),
  ));
  return { defaultLocale, supportedLocales: supportedLocales.length > 0 ? supportedLocales : [defaultLocale] };
}

export const getTenantLocaleConfig = cache(async (): Promise<TenantLocaleConfig> => {
  const client = getServerSupabase();
  if (!client || !tenantId) return normalizeTenantLocaleConfig(null);
  const { data, error } = await client
    .from("tenants")
    .select("default_language,supported_languages")
    .eq("id", tenantId)
    .maybeSingle();
  if (error) {
    console.error("Unable to load tenant locale configuration", { code: error.code });
    return normalizeTenantLocaleConfig(null);
  }
  return normalizeTenantLocaleConfig(data);
});
