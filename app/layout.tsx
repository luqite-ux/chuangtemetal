import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildOrganizationJsonLd, serializeJsonLd } from "@/lib/seo";
import { DEFAULT_LOCALE, extractLocaleFromPathname } from "@/lib/i18n";
import { getTenantLocaleConfig } from "@/lib/tenant-config";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { defaultLocale } = await getTenantLocaleConfig();
  return {
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    title: { default: "ChuangTe Metal | Heat-Resistant Steel Castings", template: "%s | ChuangTe Metal" },
    description: SITE_CONFIG.tagline,
    icons: { icon: "/icon.png", apple: "/icon.png" },
    openGraph: { title: "ChuangTe Metal", description: SITE_CONFIG.tagline, type: "website", url: `/${defaultLocale}`, images: [{ url: "/images/factory/factory-main.png" }] },
    twitter: { card: "summary_large_image", title: "ChuangTe Metal", description: SITE_CONFIG.tagline, images: ["/images/factory/factory-main.png"] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [requestHeaders, localeConfig] = await Promise.all([headers(), getTenantLocaleConfig()]);
  const locale = extractLocaleFromPathname(requestHeaders.get("x-page-pathname") || "/", localeConfig.defaultLocale || DEFAULT_LOCALE);
  return (
    <html lang={locale}>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildOrganizationJsonLd(localeConfig.defaultLocale)) }} />
        {children}
      </body>
    </html>
  );
}
