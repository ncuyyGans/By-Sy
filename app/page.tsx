import Link from "next/link";
import { posts, siteContent } from "@/lib/content";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="logo" href="/">{siteContent.name}</Link>
        <nav className="nav" aria-label="Navigasi utama">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <a href="mailto:hello@example.com">Email</a>
        </nav>
      </header>
      <section className="hero">
        <div className="eyebrow">Personal notes / 2026</div>
        <h1>Hai, aku {siteContent.name}.</h1>
        <p className="lede">{siteContent.intro}</p>
      </section>
      <section className="section" aria-labelledby="latest-heading">
        <div className="section-heading"><h2 id="latest-heading">Tulisan terbaru</h2><Link className="text-link" href="/blog">Lihat semua →</Link></div>
        <div className="post-list">{posts.slice(0, 3).map((post) => <PostPreview key={post.slug} post={post} />)}</div>
      </section>
      <footer className="site-footer"><p>{siteContent.footer}</p></footer>
    </main>
  );
}

function PostPreview({ post }: { post: (typeof posts)[number] }) {
  return <Link className="post-card" href={`/blog/${post.slug}`}><div className="post-meta">{post.date}<br />{post.readingTime}</div><div><span className="tag">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div></Link>;
}
