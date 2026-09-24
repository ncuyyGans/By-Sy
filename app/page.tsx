import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime, type Post } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  const socials = [["GitHub", settings.github_url], ["Instagram", settings.instagram_url], ["X / Twitter", settings.x_url]].filter(([, url]) => Boolean(url));
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="profile-hero"><p className="intro-label">Hello, I&apos;m</p><h1>{settings.name}</h1><div className="profile-copy"><p className="role">{settings.role}</p><p>{settings.intro}</p></div><div className="profile-meta"><span>{settings.location}</span><div>{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>)}<a href={`mailto:${settings.email}`}>Email</a></div></div></section><section className="writing-section"><div className="section-heading"><h2>Recent writing</h2><Link href="/blog">View all</Link></div>{posts.length ? <div className="post-list">{posts.slice(0, 5).map((post) => <PostRow key={post.id} post={post} />)}</div> : <div className="empty-state"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}

function PostRow({ post }: { post: Post }) {
  return <Link className="post-row" href={`/blog/${post.slug}`}><div><h3>{post.title}</h3><p>{post.excerpt}</p></div><div className="post-meta"><span>{formatDate(post.published_at)}</span><span>{readingTime(post.body)} baca</span></div></Link>;
}
