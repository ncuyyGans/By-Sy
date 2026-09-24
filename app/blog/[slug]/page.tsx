import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPostBySlug, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

function containsHtml(value: string) { return /<[a-z][\s\S]*>/i.test(value); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  return <main className="site-shell"><SiteHeader settings={settings} /><article className="article"><Link className="back-link" href="/blog">← Back to writing</Link><header className="article-header"><div className="hero-kicker"><span>{post.category}</span><span>{formatDate(post.published_at)} / {readingTime(post.body.replace(/<[^>]*>/g, " "))} baca</span></div><h1>{post.title}</h1>{post.excerpt && <p className="article-deck">{post.excerpt}</p>}</header>{post.cover_url && <img className="article-cover" src={post.cover_url} alt="" />}{containsHtml(post.body) ? <div className="article-body rich-content" dangerouslySetInnerHTML={{ __html: post.body }} /> : <div className="article-body">{post.body.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}<div className="article-end"><span>●</span><p>End of note.</p></div></article><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
