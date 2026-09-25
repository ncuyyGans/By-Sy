import { articleHtml } from "@/lib/article-html";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPostBySlug, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  return <main className="site-shell"><SiteHeader settings={settings} /><article className="article"><Link className="back-link" href="/blog">← Back to writing</Link><header className="article-header"><span className="tag">{post.category}</span><h1>{post.title}</h1>{post.excerpt && <p className="article-deck">{post.excerpt}</p>}<div className="article-meta">{formatDate(post.published_at)} · {readingTime(post.body.replace(/<[^>]*>/g, " "))} baca</div></header>{post.cover_url && <img className="article-cover" src={post.cover_url} alt="" />}<div className="article-body rich-content" dangerouslySetInnerHTML={{ __html: articleHtml(post.body) }} /><div className="article-end">Thanks for reading.</div></article><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
