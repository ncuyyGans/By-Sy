import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/data";
import { loadPreviewPost } from "@/lib/preview-post";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Preview privat | By-Sy",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadPreviewPost(await createClient(), id);
  if (result.kind === "unauthorized") redirect("/admin/login");
  if (result.kind === "not-found") notFound();
  const settings = await getSiteSettings();
  return <main className="site-shell">
    <aside className="preview-notice" aria-label="Status preview">
      <strong>Preview privat · {result.post.status === "draft" ? "Draft" : "Published"}</strong>
      <p>Ini versi terakhir yang tersimpan. Membuka preview tidak menerbitkan tulisan.</p>
    </aside>
    <SiteHeader settings={settings} />
    <ArticleView post={result.post} backHref={`/admin/posts/${id}`} backLabel="← Kembali ke editor" />
    <footer className="site-footer"><p>{settings.footer}</p><p>© {new Date().getFullYear()}</p></footer>
  </main>;
}
