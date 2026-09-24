import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime, type Post } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="hero"><div className="eyebrow">Personal notes</div><h1>Hai, aku {settings.name}.</h1><p className="lede">{settings.intro}</p></section><section className="section" aria-labelledby="latest-heading"><div className="section-heading"><h2 id="latest-heading">Tulisan terbaru</h2><Link className="text-link" href="/blog">Lihat semua →</Link></div>{posts.length ? <div className="post-list">{posts.slice(0, 3).map((post) => <PostPreview key={post.id} post={post} />)}</div> : <div className="empty-state"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p></footer></main>;
}

function PostPreview({ post }: { post: Post }) {
  return <Link className="post-card" href={`/blog/${post.slug}`}><div className="post-meta">{formatDate(post.published_at)}<br />{readingTime(post.body)}</div><div><span className="tag">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div></Link>;
}
