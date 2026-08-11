import { ClipboardCheck, FileText, ScanSearch } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildTenantPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildTenantPageMetadata(
    "Quality & Documentation",
    "Order-specific quality control, inspection documentation and third-party inspection support for custom heat-resistant steel castings.",
    "/quality",
    locale,
  );
}

const practices = [
  {
    icon: ClipboardCheck,
    title: "Drawing & specification review",
    text: "Each non-standard tray or rack is developed against the supplied drawing, material request and operating conditions before production scope is confirmed.",
  },
  {
    icon: FileText,
    title: "Inspection documentation",
    text: "Technical data sheets and inspection or quality reports can be provided. The required document package is confirmed for each order.",
  },
  {
    icon: ScanSearch,
    title: "Third-party inspection",
    text: "Third-party inspection is supported by prior arrangement so the inspection stage and requested records can be coordinated with production.",
  },
];

export default function QualityPage() {
  return <>
    <PageHero
      eyebrow="Quality & documentation"
      title="Inspection scope made clear before production."
      description="A practical framework for drawing review, quality control, inspection records and order-specific documentation."
    />
    <section className="section">
      <div className="shell capability-card-grid quality-grid">
        {practices.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} className="capability-card" delay={index * .08}>
            <Icon />
            <h2>{title}</h2>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
    <section className="section capacity-callout">
      <div className="shell capacity-grid">
        <Reveal><span className="eyebrow">Order-specific records</span><h2>Define the required checks with the drawing.</h2></Reveal>
        <Reveal><p>Inspection items, document format and third-party participation are reviewed against the product, alloy and order requirements. Public claims are limited to the scope confirmed in the supplied company information.</p></Reveal>
      </div>
    </section>
  </>;
}
