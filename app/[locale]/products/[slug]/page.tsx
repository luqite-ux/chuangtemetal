import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { ImageGallery } from "@/components/image-gallery";
import { Reveal } from "@/components/motion/reveal";
import { FALLBACK_PRODUCTS } from "@/lib/products-fallback";
import { getProductBySlug } from "@/lib/products-db";
import { buildProductJsonLd, buildProductMetadata } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() { return FALLBACK_PRODUCTS.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; const product = await getProductBySlug(slug, locale); return product ? buildProductMetadata(product, locale) : {}; }

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params; const product = await getProductBySlug(slug, locale); if (!product) notFound();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product, locale)) }} />
    <section className="product-detail-hero"><div className="shell product-detail-grid"><Reveal><ImageGallery images={product.gallery} alt={product.name} /></Reveal><Reveal className="product-detail-copy"><span className="eyebrow">{product.eyebrow}</span><h1>{product.name}</h1><p className="lead">{product.summary}</p><p>{product.description}</p><div className="spec-grid">{product.specifications.map((spec) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div><Link href={`/en/request-a-quote?product=${encodeURIComponent(product.name)}`} className="button button-primary">Request this product <ArrowRight size={17} /></Link></Reveal></div></section>
    <section className="section detail-section"><div className="shell detail-columns"><Reveal><span className="eyebrow">Design priorities</span><h2>Developed for the intended operating condition.</h2></Reveal><div className="feature-list">{product.features.map((feature) => <div key={feature}><Check /><span>{feature}</span></div>)}</div></div></section>
    <section className="section applications-band"><div className="shell"><span className="eyebrow">Applications</span><div className="application-tags">{product.applications.map((item) => <span key={item}>{item}</span>)}</div></div></section>
  </>;
}
