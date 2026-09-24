import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="archive-hero"><div className="hero-kicker"><span>Archive</span><span>{posts.length} entries</span></div><h1>THINGS I<br />WROTE.</h1><p>Cerita, opini, catatan belajar, dan visual yang ingin kusimpan di internet.</p></section><section className="archive-list">{posts.length ? posts.map((post, index) => <Link className="archive-row" href={`/blog/${post.slug}`} key={post.id}><span>{String(index + 1).padStart(2, "0")}</span><div><span className="tag">{post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p></div><div className="row-meta"><span>{formatDate(post.published_at)}</span><span>{readingTime(post.body)} baca</span><b>↗</b></div></Link>) : <div className="empty-state large-empty"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
