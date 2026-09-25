import { ArticleView } from "@/components/article-view";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug, getSiteSettings } from "@/lib/data";

export const revalidate = 60;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();
  return <main className="site-shell"><SiteHeader settings={settings} /><ArticleView post={post} /><footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer></main>;
}
