import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPostBySlug, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  return <main className="site-shell"><SiteHeader settings={settings} /><article className="article"><Link className="back-link" href="/blog">← Kembali ke blog</Link><div className="eyebrow">{post.category} · {formatDate(post.published_at)} · {readingTime(post.body)}</div><h1>{post.title}</h1>{post.cover_url && <img className="article-cover" src={post.cover_url} alt="" />}<div className="article-body">{post.body.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></article><footer className="site-footer"><p>{settings.footer}</p></footer></main>;
}
