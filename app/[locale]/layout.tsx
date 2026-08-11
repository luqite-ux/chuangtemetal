import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isSupportedLocale } from "@/lib/i18n";
import { getTenantLocaleConfig } from "@/lib/tenant-config";

export const revalidate = 60;

export async function generateStaticParams() {
  const config = await getTenantLocaleConfig();
  return config.supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const config = await getTenantLocaleConfig();
  if (!isSupportedLocale(locale, config.supportedLocales)) notFound();
  return <><SiteHeader currentLocale={locale} supportedLocales={config.supportedLocales} /><main>{children}</main><SiteFooter /></>;
}
