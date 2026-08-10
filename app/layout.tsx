import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildOrganizationJsonLd } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: { default: "ChuangTe Metal | Heat-Resistant Steel Castings", template: "%s | ChuangTe Metal" },
  description: SITE_CONFIG.tagline,
  icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
  openGraph: { title: "ChuangTe Metal", description: SITE_CONFIG.tagline, type: "website", url: "/en", images: [{ url: "/images/factory/factory-main.png" }] },
  twitter: { card: "summary_large_image", title: "ChuangTe Metal", description: SITE_CONFIG.tagline, images: ["/images/factory/factory-main.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
        {children}
      </body>
    </html>
  );
}
