import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { createClient } from "@/lib/supabase/server";
import { defaultSettings, formatDate, type Post, type SiteSettings } from "@/lib/data";
import { deletePost, updateSettings } from "@/app/admin/actions";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const [{ data: posts }, { data: settings }] = await Promise.all([
    supabase.from("posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  const site = (settings as SiteSettings | null) ?? defaultSettings;
  return <AdminShell><div className="dashboard-stack"><section><div className="admin-section-heading"><div><h2>Tulisan</h2><p>Kelola draft dan tulisan yang sudah diterbitkan.</p></div><Link className="button" href="/admin/posts/new">+ Tulisan baru</Link></div><div className="admin-card table-wrap">{posts?.length ? <table><thead><tr><th>Judul</th><th>Status</th><th>Diperbarui</th><th></th></tr></thead><tbody>{(posts as Post[]).map((post) => <tr key={post.id}><td><strong>{post.title}</strong><small>{post.category}</small></td><td><span className={`status status-${post.status}`}>{post.status}</span></td><td>{formatDate(post.updated_at)}</td><td><div className="row-actions"><Link className="text-link" href={`/admin/posts/${post.id}`}>Edit</Link><form action={deletePost}><input type="hidden" name="id" value={post.id} /><button className="danger-link">Hapus</button></form></div></td></tr>)}</tbody></table> : <div className="empty-state"><p>Belum ada tulisan. Buat tulisan pertamamu.</p></div>}</div></section><section className="admin-card"><h2>Pengaturan website</h2><p>Konten ini muncul di homepage, navigasi, dan footer.</p>{saved && <div className="notice">Pengaturan berhasil disimpan.</div>}<form action={updateSettings} className="form-grid"><label>Nama<input name="name" defaultValue={site.name} required /></label><label>Intro homepage<textarea className="short-textarea" name="intro" defaultValue={site.intro} required /></label><label>Email publik<input name="email" type="email" defaultValue={site.email} required /></label><label>Footer<input name="footer" defaultValue={site.footer} required /></label><button className="button" type="submit">Simpan pengaturan</button></form></section></div></AdminShell>;
}
