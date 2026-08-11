export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE] as const;

export type SupportedLocale = string;
export type LocalizedText = Record<string, string | null | undefined>;
export type LocalePageProps = { params: Promise<{ locale: string }> };

export function isSupportedLocale(value: string, enabledLocales: readonly string[] = SUPPORTED_LOCALES): value is SupportedLocale {
  return enabledLocales.includes(value);
}

export function buildLocalePath(locale: string, pathname = "") {
  const normalizedLocale = locale.trim().toLowerCase() || DEFAULT_LOCALE;
  const normalizedPath = !pathname || pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${normalizedLocale}${normalizedPath}`;
}

export function replacePathLocale(pathname: string, nextLocale: string) {
  const [path, query = ""] = pathname.split("?", 2);
  const segments = path.split("/").filter(Boolean);
  const suffix = segments.slice(1).join("/");
  const localized = buildLocalePath(nextLocale, suffix);
  return query ? `${localized}?${query}` : localized;
}

const localeRoutePattern = /^[a-z]{2}(?:-[a-z]{2})?$/;

export function extractLocaleFromPathname(pathname: string, fallbackLocale: string = DEFAULT_LOCALE) {
  const candidate = pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
  return localeRoutePattern.test(candidate) ? candidate : fallbackLocale;
}

export function resolveLocalizedValue(
  values: LocalizedText | null | undefined,
  requestedLocale: string,
  defaultLocale: string = DEFAULT_LOCALE,
): string {
  if (!values) return "";
  const requested = values[requestedLocale]?.trim();
  if (requested) return requested;
  const fallback = values[defaultLocale]?.trim();
  if (fallback) return fallback;
  return Object.values(values).find((value) => value?.trim())?.trim() ?? "";
}
