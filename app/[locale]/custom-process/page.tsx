import { CheckCircle2, FileSearch, Flame, PackageCheck, Shapes, TestTubeDiagonal } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildTenantPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return buildTenantPageMetadata("Custom Casting Process", "A six-stage custom casting workflow from drawing review through inspection and delivery.", "/custom-process", locale); }

const steps = [
  { icon: FileSearch, title: "Requirement review", text: "Review the supplied drawing, dimensions, loading method, furnace conditions and requested quantity." },
  { icon: TestTubeDiagonal, title: "Material selection", text: "Confirm the requested heat-resistant grade or review material direction against the stated operating condition." },
  { icon: Shapes, title: "Molding", text: "Prepare the sand-casting process around the confirmed geometry and production requirements." },
  { icon: Flame, title: "Casting", text: "Produce the custom tray or rack within the confirmed alloy, geometry and order scope." },
  { icon: CheckCircle2, title: "Inspection", text: "Complete the agreed dimensional, visual and order-specific inspection activities before release." },
  { icon: PackageCheck, title: "Delivery", text: "Prepare the finished casting and confirmed documentation for shipment according to the order arrangement." },
];

export default function CustomProcessPage() {
  return <>
    <PageHero eyebrow="Custom process" title="From drawing review to finished casting." description="A clear six-stage workflow for non-standard heat-resistant charge trays and racks, with scope confirmed against each order." />
    <section className="section">
      <div className="shell capability-card-grid">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} className="capability-card" delay={index * .06}>
            <Icon />
            <span className="eyebrow">Step {String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  </>;
}
