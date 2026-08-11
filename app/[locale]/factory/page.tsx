import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildTenantPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return buildTenantPageMetadata("Factory", "Explore ChuangTe Metal's 8,000 m² facility, two workshops, three production lines and real equipment photography.", "/factory", locale); }
const images = ["factory-main.png", "equipment-main.png", ...Array.from({ length: 8 }, (_, i) => `factory-${String(i + 1).padStart(2, "0")}.png`)];
export default function FactoryPage() { return <><PageHero eyebrow="Factory" title="An 8,000 m² production base in Taixing, Jiangsu." description="A real-photo view of two workshops, three production lines and the manufacturing environment behind each order." /><section className="section"><div className="shell factory-stats"><div><strong>8,000 m²</strong><span>Facility</span></div><div><strong>2</strong><span>Workshops</span></div><div><strong>3</strong><span>Production lines</span></div></div><div className="shell factory-gallery">{images.map((image, index) => <Reveal key={image} className={index % 4 === 0 ? "gallery-wide" : ""}><div className="factory-gallery-image"><Image src={`/images/factory/${image}`} alt={`ChuangTe Metal factory view ${index + 1}`} fill sizes="(max-width: 720px) 100vw, 50vw" /></div></Reveal>)}</div></section></>; }
