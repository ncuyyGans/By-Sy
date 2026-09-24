import Link from "next/link";
import { posts, siteContent } from "@/lib/content";

export default function BlogPage() {
  return <main className="site-shell"><header className="site-header"><Link className="logo" href="/">{siteContent.name}</Link><nav className="nav"><Link href="/">Home</Link><Link href="/blog">Blog</Link><a href="mailto:hello@example.com">Email</a></nav></header><section className="article"><div className="eyebrow">Archive</div><h1>Semua tulisan</h1><p className="lede">Cerita, opini, catatan belajar, dan visual yang ingin kusimpan.</p><div className="post-list">{posts.map((post) => <Link className="post-card" href={`/blog/${post.slug}`} key={post.slug}><div className="post-meta">{post.date}<br />{post.readingTime}</div><div><span className="tag">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div></Link>)}</div></section><footer className="site-footer"><p>{siteContent.footer}</p></footer></main>;
}
