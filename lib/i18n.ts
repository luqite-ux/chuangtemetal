export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type LocalizedText = Record<string, string | null | undefined>;

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function resolveLocalizedValue(
  values: LocalizedText | null | undefined,
  requestedLocale: string,
  defaultLocale = DEFAULT_LOCALE,
): string {
  if (!values) return "";
  const requested = values[requestedLocale]?.trim();
  if (requested) return requested;
  const fallback = values[defaultLocale]?.trim();
  if (fallback) return fallback;
  return Object.values(values).find((value) => value?.trim())?.trim() ?? "";
}
