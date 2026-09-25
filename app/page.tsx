import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { formatDate, getAboutPage, getProjects, getPublishedPosts, getSiteSettings, readingTime, type Post } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [posts, settings, about, projects] = await Promise.all([getPublishedPosts(), getSiteSettings(), getAboutPage(), getProjects()]);
  const socials = [["GitHub", settings.github_url], ["Instagram", settings.instagram_url], ["X / Twitter", settings.x_url]].filter(([, url]) => Boolean(url));
  return <main className="site-shell"><SiteHeader settings={settings} /><section className="profile-hero"><p className="intro-label">Hello, I&apos;m</p><h1>{settings.name}</h1><div className="profile-copy"><p className="role">{settings.role}</p><p>{settings.intro}</p></div><div className="profile-meta"><span>{settings.location}</span><div>{socials.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>)}<a href={`mailto:${settings.email}`}>Email</a></div></div></section><section className="home-preview-section"><div className="section-heading"><h2>About</h2><Link href="/about">Selengkapnya</Link></div><div className="about-preview"><span className="eyebrow">{about.story_label}</span><h3>{about.story_title}</h3><p>{about.story_body}</p><ul><li>{about.focus_1}</li><li>{about.focus_2}</li><li>{about.focus_3}</li></ul></div></section><section className="home-preview-section"><div className="section-heading"><h2>Karya</h2><Link href="/projects">View all</Link></div>{projects.length ? <div className="home-project-list">{projects.slice(0, 3).map(project => <article className="home-project-row" key={project.id}><div><span className="eyebrow">{project.eyebrow}</span><h3>{project.title}</h3><p>{project.description}</p></div><div className="home-project-meta"><span>{project.year}</span><span>{project.tags.slice(0, 2).join(" · ")}</span></div></article>)}</div> : <div className="empty-state"><p>Belum ada karya yang ditampilkan.</p></div>}</section><section className="writing-section"><div className="section-heading"><h2>Recent writing</h2><Link href="/blog">View all</Link></div>{posts.length ? <div className="post-list">{posts.slice(0, 5).map((post) => <PostRow key={post.id} post={post} />)}</div> : <div className="empty-state"><p>Belum ada tulisan yang diterbitkan.</p></div>}</section><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}

function PostRow({ post }: { post: Post }) {
  return <Link className="post-row" href={`/blog/${post.slug}`}><div><h3>{post.title}</h3><p>{post.excerpt}</p></div><div className="post-meta"><span>{formatDate(post.published_at)}</span><span>{readingTime(post.body)} baca</span></div></Link>;
}
