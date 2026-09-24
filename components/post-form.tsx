import type { Post } from "@/lib/data";
import { CoverUploader } from "@/components/cover-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";

const categories = ["Cerita", "Opini", "Catatan Belajar", "Visual"];

export function PostForm({ action, post, error }: { action: (formData: FormData) => void | Promise<void>; post?: Post; error?: string }) {
  return <form action={action} className="admin-card form-grid">{post && <input type="hidden" name="id" value={post.id} />}<input type="hidden" name="published_at" value={post?.published_at ?? ""} />{error && <div className="form-error">{error}</div>}<label>Judul<input name="title" defaultValue={post?.title} required /></label><label>Slug<input name="slug" defaultValue={post?.slug} placeholder="dibuat-otomatis-dari-judul" /></label><label>Ringkasan<textarea className="short-textarea" name="excerpt" defaultValue={post?.excerpt ?? ""} /></label><div className="two-columns"><label>Kategori<select name="category" defaultValue={post?.category ?? "Cerita"}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Status<select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></label></div><label>Cover image<CoverUploader defaultValue={post?.cover_url ?? ""} /></label><label>Isi artikel<RichTextEditor defaultValue={post?.body ?? ""} /></label><div className="form-actions"><button className="button" type="submit">{post ? "Simpan perubahan" : "Buat tulisan"}</button><a className="text-link" href="/admin">Batal</a></div></form>;
}
