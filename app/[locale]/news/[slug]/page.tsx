import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles-db";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  return article ? buildPageMetadata(article.title, article.excerpt, `/news/${slug}`, article.featuredImage || "/images/factory/factory-main.png", "article") : {};
}

export default async function NewsArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: `/${locale}` },
    { name: "News", path: `/${locale}/news` },
    { name: article.title, path: `/${locale}/news/${article.slug}` },
  ]);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(article, locale)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <article className="article-page"><header className="article-header shell"><span className="eyebrow">News & insights</span><h1>{article.title}</h1><p>{article.excerpt}</p>{article.publishedAt && <time>{new Date(article.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>}</header>{article.featuredImage && <div className="article-image shell"><Image src={article.featuredImage} alt={article.title} fill sizes="100vw" priority /></div>}<div className="article-prose shell" dangerouslySetInnerHTML={{ __html: article.content }} /></article>
  </>;
}
