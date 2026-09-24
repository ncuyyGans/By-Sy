import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, siteContent } from "@/lib/content";

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <main className="site-shell"><header className="site-header"><Link className="logo" href="/">{siteContent.name}</Link><nav className="nav"><Link href="/">Home</Link><Link href="/blog">Blog</Link><a href="mailto:hello@example.com">Email</a></nav></header><article className="article"><Link className="back-link" href="/blog">← Kembali ke blog</Link><div className="eyebrow">{post.category} · {post.date} · {post.readingTime}</div><h1>{post.title}</h1><div className="article-body">{post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article><footer className="site-footer"><p>{siteContent.footer}</p></footer></main>;
}
