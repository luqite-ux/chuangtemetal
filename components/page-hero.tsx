import Link from "next/link";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="shell page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="hero-actions">
          <Link href="/en/request-a-quote" className="button button-primary">Start an RFQ</Link>
          <Link href="/en/products" className="text-link">Explore products <span>↗</span></Link>
        </div>
      </div>
    </section>
  );
}
