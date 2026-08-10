import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductRecord } from "@/lib/products-fallback";

export function ProductCard({ product }: { product: ProductRecord }) {
  return (
    <article className="product-card">
      <Link href={`/en/products/${product.slug}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 820px) 100vw, 50vw" />
        <span className="product-temp">800–1100°C</span>
      </Link>
      <div className="product-card-body">
        <span className="eyebrow">{product.eyebrow}</span>
        <h2>{product.name}</h2>
        <p>{product.summary}</p>
        <Link href={`/en/products/${product.slug}`} className="text-link">
          View product <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
