import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion/reveal";
import { fetchProductsData } from "@/lib/products-db";
import { buildTenantPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildTenantPageMetadata("Heat-Resistant Steel Products", "Custom charge trays and charge racks for high-temperature furnace loading.", "/products", locale);
}
export const revalidate = 60;

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await fetchProductsData(locale);
  return <><PageHero eyebrow="Products" title="Two fixture families. Built to your drawings." description="Launch products focus on the two supplied heat-treatment fixture categories, with no unsupported catalogue filler." /><section className="section"><div className="shell product-grid">{products.map((product, index) => <Reveal key={product.slug} delay={index * .1}><ProductCard product={product} /></Reveal>)}</div></section></>;
}
