import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getPublishedArticles } from "@/lib/articles-db";
import { buildTenantPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return buildTenantPageMetadata("News & Insights", "Future technical insights and company updates from ChuangTe Metal.", "/news", locale); }
export const revalidate = 60;
export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; const articles = await getPublishedArticles(locale); return <><PageHero eyebrow="News & insights" title="Technical notes and company updates." description="This content area is ready for future SEO articles, process knowledge and verified company news." /><section className="section">{articles.length === 0 ? <div className="shell empty-state"><Newspaper /><h2>Insights are being prepared.</h2><p>Future articles will appear here automatically after they are reviewed and published through the customer content system.</p></div> : <div className="shell news-grid">{articles.map((article) => <article className="news-card" key={article.slug}>{article.featuredImage && <div className="news-image"><Image src={article.featuredImage} alt={article.title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>}<span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" }) : "Insight"}</span><h2>{article.title}</h2><p>{article.excerpt}</p><Link className="text-link" href={`/${locale}/news/${article.slug}`}>Read article</Link></article>)}</div>}</section></>; }
