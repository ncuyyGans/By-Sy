import Link from "next/link";
import { articleHtml } from "@/lib/article-html";
import { formatDate, readingTime, type Post } from "@/lib/data";

export function ArticleView({ post, backHref = "/blog", backLabel = "← Back to writing" }: {
  post: Post;
  backHref?: string;
  backLabel?: string;
}) {
  return <article className="article"><Link className="back-link" href={backHref}>{backLabel}</Link><header className="article-header"><span className="tag">{post.category}</span><h1>{post.title}</h1>{post.excerpt && <p className="article-deck">{post.excerpt}</p>}<div className="article-meta">{formatDate(post.published_at)} · {readingTime(post.body.replace(/<[^>]*>/g, " "))} baca</div></header>{post.cover_url && <img className="article-cover" src={post.cover_url} alt="" />}<div className="article-body rich-content" dangerouslySetInnerHTML={{ __html: articleHtml(post.body) }} /><div className="article-end">Thanks for reading.</div></article>;
}
