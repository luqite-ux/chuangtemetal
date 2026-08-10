import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "News & Insights", description: "Future technical insights and company updates from ChuangTe Metal.", alternates: { canonical: "/en/news" } };
export const revalidate = 60;
export default function NewsPage() { return <><PageHero eyebrow="News & insights" title="Technical notes and company updates." description="This content area is ready for future SEO articles, process knowledge and verified company news." /><section className="section"><div className="shell empty-state"><Newspaper /><h2>Insights are being prepared.</h2><p>Future articles will appear here automatically after they are reviewed and published through the customer content system.</p></div></section></>; }
