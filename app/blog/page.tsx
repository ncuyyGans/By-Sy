import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="archive-hero"><p className="intro-label">Personal archive</p><h1>Writing</h1><p>Cerita, opini, catatan belajar, dan visual yang ingin kusimpan di internet.</p></section><section className="archive-list">{posts.length ? posts.map((post) => <Link className="post-row" href={`/blog/${post.slug}`} key={post.id}><div><span className="tag">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div><div className="post-meta"><span>{formatDate(post.published_at)}</span><span>{readingTime(post.body)} baca</span></div></Link>) : <div className="empty-state"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
