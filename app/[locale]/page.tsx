import Image from "next/image";
import { ArrowRight, Flame, Layers3, Ruler, Settings2 } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product-card";
import { ThermalFlow } from "@/components/thermal-flow";
import { buildTenantPageMetadata } from "@/lib/seo";
import { LocaleLink } from "@/components/locale-link";
import { fetchProductsData } from "@/lib/products-db";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildTenantPageMetadata("Custom Heat-Resistant Steel Castings", "Custom heat-resistant steel charge trays and racks engineered from drawings for 800–1100°C furnace environments.", "", locale);
}

const process = ["Requirement review", "Material selection", "Molding", "Casting", "Inspection", "Delivery"];
const industries = ["Metallurgy", "Power", "Petrochemical", "Mining", "Heat treatment"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await fetchProductsData(locale);
  return (
    <>
      <section className="home-hero">
        <Image src="/images/factory/factory-main.png" alt="ChuangTe Metal production workshop" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-overlay" aria-hidden="true" />
        <ThermalFlow />
        <div className="shell home-hero-content">
          <Reveal>
            <span className="eyebrow eyebrow-on-image"><Flame size={15} /> Engineered for extreme heat</span>
            <h1>Heat-Resistant Steel Castings, <em>Engineered for Extreme Conditions.</em></h1>
            <p>Custom charge trays and racks developed from your drawings for demanding heat-treatment furnace environments.</p>
            <div className="hero-actions">
              <LocaleLink href="/products" className="button button-primary">Explore Products <ArrowRight size={17} /></LocaleLink>
              <LocaleLink href="/request-a-quote" className="button button-glass">Request a Quote</LocaleLink>
            </div>
          </Reveal>
        </div>
        <div className="hero-scroll">Scroll to explore <span /></div>
      </section>

      <section className="metrics-band" aria-label="Manufacturing facts">
        <div className="shell metrics-grid">
          <div><strong><CountUp value={40} suffix="+" /></strong><span>Years of casting experience</span></div>
          <div><strong><CountUp value={8000} suffix=" m²" /></strong><span>Production facility</span></div>
          <div><strong><CountUp value={3} /></strong><span>Production lines</span></div>
          <div><strong><CountUp value={12} suffix=" t" /></strong><span>Maximum single casting</span></div>
        </div>
      </section>

      <section className="section product-showcase">
        <div className="shell">
          <Reveal className="section-heading split-heading">
            <div><span className="eyebrow">Core products</span><h2>Built around your furnace,<br />load and process.</h2></div>
            <p>Every fixture begins with operating conditions and customer drawings—not a fixed catalogue shape.</p>
          </Reveal>
          <div className="product-grid">
            {products.map((product, index) => <Reveal key={product.slug} delay={index * 0.12}><ProductCard product={product} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <Reveal className="section-heading center-heading"><span className="eyebrow">From drawing to casting</span><h2>A clear path from requirements<br />to finished fixture.</h2></Reveal>
          <div className="process-track">
            {process.map((item, index) => <Reveal key={item} className="process-step" delay={index * 0.08}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></Reveal>)}
          </div>
          <Reveal className="process-link"><LocaleLink href="/custom-process" className="text-link">View the complete custom process <ArrowRight size={17} /></LocaleLink></Reveal>
        </div>
      </section>

      <section className="section industries-section">
        <div className="shell industries-layout">
          <Reveal className="industries-copy"><span className="eyebrow">Industries we serve</span><h2>Cast for heat, load and repeatable handling.</h2><p>Our heat-resistant fixtures support demanding thermal processes across five supplied application sectors.</p><LocaleLink href="/industries" className="text-link">Explore applications <ArrowRight size={17} /></LocaleLink></Reveal>
          <div className="industries-list">
            {industries.map((industry, index) => <Reveal key={industry} className="industry-row" delay={index * 0.08}><span>0{index + 1}</span><h3>{industry}</h3><ArrowRight /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section factory-feature">
        <div className="shell factory-feature-grid">
          <Reveal className="factory-collage">
            <div className="factory-image-large"><Image src="/images/factory/equipment-main.png" alt="Core production equipment" fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
            <div className="factory-image-small"><Image src="/images/factory/factory-01.png" alt="ChuangTe Metal factory entrance" fill sizes="300px" /></div>
          </Reveal>
          <Reveal className="factory-copy">
            <span className="eyebrow">Inside ChuangTe</span><h2>Real manufacturing capacity, clearly presented.</h2>
            <p>Established in 2017 in Taixing, Jiangsu, ChuangTe Metal operates an 8,000 m² facility with two workshops and three production lines.</p>
            <div className="capability-icons"><span><Layers3 />2 workshops</span><span><Settings2 />3 production lines</span><span><Ruler />Up to 12 t</span></div>
            <LocaleLink href="/factory" className="button button-secondary">Explore the factory</LocaleLink>
          </Reveal>
        </div>
      </section>

      <section className="section final-cta"><div className="shell"><Reveal className="final-cta-card"><span className="eyebrow">Have a drawing?</span><h2>Let’s turn operating conditions into a casting brief.</h2><p>Share dimensions, material requirements, load arrangement and furnace temperature with our team.</p><LocaleLink href="/request-a-quote" className="button button-primary">Start your RFQ <ArrowRight size={17} /></LocaleLink></Reveal></div></section>
    </>
  );
}
