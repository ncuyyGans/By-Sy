import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getPublishedPosts, getSiteSettings, readingTime, type Post } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [posts, settings] = await Promise.all([getPublishedPosts(), getSiteSettings()]);
  const socials = [
    ["GitHub", settings.github_url],
    ["Instagram", settings.instagram_url],
    ["X / Twitter", settings.x_url],
    ["Email", `mailto:${settings.email}`],
  ].filter(([, url]) => Boolean(url));

  return <main className="site-shell"><SiteHeader settings={settings} /><section className="profile-hero"><div className="hero-kicker"><span>Personal journal</span><span>{settings.location}</span></div><div className="hero-name" aria-label={`Hai, aku ${settings.name}`}><span>HI, I&apos;M</span><strong>{settings.name.toUpperCase()}</strong></div><div className="hero-bottom"><div className="availability"><span className="pulse-dot" />Available on the internet</div><div className="hero-copy"><p className="role">{settings.role}</p><p>{settings.intro}</p><div className="social-list">{socials.map(([label, url]) => <a key={label} href={url} target={url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{label} ↗</a>)}</div></div></div></section><section className="writing-section"><div className="section-label"><span>01</span><span>Latest writing</span><Link href="/blog">View archive ↗</Link></div>{posts.length ? <div className="editorial-list">{posts.slice(0, 4).map((post, index) => <PostRow key={post.id} post={post} index={index + 1} />)}</div> : <div className="empty-state large-empty"><p>Belum ada tulisan yang diterbitkan.</p><span>Tulisan pertamamu akan muncul di sini.</span></div>}</section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()} / {settings.location}</p></footer></main>;
}

function PostRow({ post, index }: { post: Post; index: number }) {
  return <Link className="editorial-row" href={`/blog/${post.slug}`}><span className="row-number">{String(index).padStart(2, "0")}</span><div><span className="tag">{post.category}</span><h2>{post.title}</h2><p>{post.excerpt}</p></div><div className="row-meta"><span>{formatDate(post.published_at)}</span><span>{readingTime(post.body)} baca</span><b>↗</b></div></Link>;
}
