import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime } from "@/lib/data";

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="article"><div className="eyebrow">Archive</div><h1>Semua tulisan</h1><p className="lede">Cerita, opini, catatan belajar, dan visual yang ingin kusimpan.</p>{posts.length ? <div className="post-list">{posts.map((post) => <Link className="post-card" href={`/blog/${post.slug}`} key={post.id}><div className="post-meta">{formatDate(post.published_at)}<br />{readingTime(post.body)}</div><div><span className="tag">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div></Link>)}</div> : <div className="empty-state"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p></footer></main>;
}
