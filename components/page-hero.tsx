import { LocaleLink } from "@/components/locale-link";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="shell page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="hero-actions">
          <LocaleLink href="/request-a-quote" className="button button-primary">Start an RFQ</LocaleLink>
          <LocaleLink href="/products" className="text-link">Explore products <span>↗</span></LocaleLink>
        </div>
      </div>
    </section>
  );
}
