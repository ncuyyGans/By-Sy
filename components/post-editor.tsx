"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { CoverUploader } from "./cover-uploader";
import { RichTextEditor } from "./rich-text-editor";
import { draftKey, readBackup, sameDraft, type DraftFields, type DraftBackup, type SavePostResult } from "@/lib/editor-draft";

export function PostEditor({ action, initial, userId, postId, publishedAt, error }: {
  action: (data: FormData) => Promise<SavePostResult>;
  initial: DraftFields; userId: string; postId?: string; publishedAt: string; error?: string;
}) {
  const router = useRouter();
  const key = draftKey(userId, postId);
  const [fields, setFields] = useState(initial);
  const [backup, setBackup] = useState<DraftBackup | null>(null);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("Cadangan hanya disimpan di browser ini.");
  const [saveError, setSaveError] = useState(error ?? "");
  const [coverBusy, setCoverBusy] = useState(false);
  const [bodyBusy, setBodyBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const dirty = !sameDraft(fields, initial);
  const completed = useRef(false);
  const edited = useRef(false);
  const current = useRef({ fields, dirty, pending: false });
  current.current.fields = fields;
  current.current.dirty = !completed.current && dirty;

  useEffect(() => {
    try {
      const stored = readBackup(localStorage.getItem(key));
      if (stored && !sameDraft(stored.fields, initial)) setBackup(stored);
    } catch { setMessage("Cadangan otomatis tidak tersedia. Simpan tulisan secara manual."); }
    setReady(true);
  }, [key, initial]);

  function persist() {
    if (!current.current.dirty) return;
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, updatedAt: Date.now(), fields: current.current.fields }));
      setMessage("Cadangan tersimpan di browser ini. Belum disimpan ke website.");
    } catch { setMessage("Cadangan gagal disimpan. Simpan tulisan secara manual sebelum keluar."); }
  }

  useEffect(() => {
    if (!ready || backup) return;
    if (!dirty) {
      if (edited.current) {
        try { localStorage.removeItem(key); setMessage("Isi editor sama dengan versi website."); } catch { /* Keep the existing backup. */ }
      }
      return;
    }
    edited.current = true;
    setMessage("Menyimpan cadangan…");
    const timer = window.setTimeout(persist, 800);
    return () => window.clearTimeout(timer);
    // Each edit restarts the debounce; latest values are read through current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, ready, backup, dirty]);

  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (!current.current.dirty) return;
      persist(); event.preventDefault(); event.returnValue = "";
    };
    const hide = () => { if (document.visibilityState === "hidden" && !backup) persist(); };
    const navigate = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || !current.current.dirty) return;
      if (link.href === location.href) return;
      persist();
      if (!window.confirm("Perubahan belum disimpan ke website. Tetap tinggalkan editor?")) {
        event.preventDefault(); event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", leave);
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("click", navigate, true);
    return () => {
      if (!backup) persist();
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("click", navigate, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, backup]);

  function clearBackup() {
    if (!backup) return;
    try { localStorage.removeItem(key); } catch { /* Continue with the current edit. */ }
    setBackup(null);
    setMessage("Cadangan lama dilewati. Perubahan baru akan dicadangkan otomatis.");
  }

  function change(name: keyof DraftFields, value: string) {
    clearBackup();
    setFields(previous => ({ ...previous, [name]: value }));
  }
  function restore() {
    if (!backup) return;
    setFields({ ...backup.fields, body: DOMPurify.sanitize(backup.fields.body), cover_url: /^https?:\/\//i.test(backup.fields.cover_url) ? backup.fields.cover_url : "" });
    setBackup(null); setRevision(value => value + 1);
  }
  function discard() {
    try { localStorage.removeItem(key); }
    catch { setMessage("Cadangan tidak dapat dihapus dari browser."); }
    setBackup(null);
  }
  async function submit(data: FormData) {
    if (coverBusy || bodyBusy) return;
    persist(); setPending(true); current.current.pending = true; setSaveError("");
    try {
      const result = await action(data);
      if ("error" in result) { setSaveError(result.error); return; }
      try { localStorage.removeItem(key); } catch { /* Keep a recoverable backup if storage is unavailable. */ }
      completed.current = true;
      current.current.dirty = false;
      router.push("/admin"); router.refresh();
    } catch { setSaveError("Tulisan belum berhasil disimpan. Periksa koneksi lalu coba lagi; isi editor tetap tersedia."); }
    finally { setPending(false); current.current.pending = false; }
  }

  return <form action={submit} className="admin-card form-grid">
    {backup && <section className="draft-notice" aria-label="Pemulihan tulisan">
      <strong>Ada cadangan tulisan di browser ini.</strong>
      <p>Cadangan dari {new Date(backup.updatedAt).toLocaleString("id-ID")}. Pilih pemulihan, gunakan versi website, atau langsung mulai mengetik untuk mengganti cadangan lama.</p>
      <div className="form-actions"><button type="button" onClick={restore}>Pulihkan cadangan</button><button type="button" onClick={discard}>Gunakan versi website</button></div>
    </section>}
    <p className="editor-help" role="status" aria-live="polite">{message}</p>
    {saveError && <div className="form-error" role="alert">{saveError}</div>}
    <fieldset className="editor-fields" disabled={pending || !ready}>
      {postId && <input type="hidden" name="id" value={postId} />}
      <input type="hidden" name="published_at" value={publishedAt} />
      <label>Judul<input name="title" value={fields.title} onChange={e => change("title", e.target.value)} required /></label>
      <label>Slug<input name="slug" value={fields.slug} onChange={e => change("slug", e.target.value)} placeholder="dibuat-otomatis-dari-judul" /></label>
      <label>Ringkasan<textarea className="short-textarea" name="excerpt" value={fields.excerpt} onChange={e => change("excerpt", e.target.value)} /></label>
      <div className="two-columns">
        <label>Kategori<select name="category" value={fields.category} onChange={e => change("category", e.target.value)}>{["Cerita", "Opini", "Catatan Belajar", "Visual"].map(category => <option key={category}>{category}</option>)}</select></label>
        <label>Status<select name="status" value={fields.status} onChange={e => change("status", e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      </div>
      <div><span id="cover-label">Cover image</span><CoverUploader key={`cover-${revision}`} defaultValue={fields.cover_url} onBusyChange={setCoverBusy} onChange={value => change("cover_url", value)} /></div>
      <div><span id="body-label">Isi artikel</span><RichTextEditor key={`body-${revision}`} defaultValue={fields.body} onBusyChange={setBodyBusy} onChange={value => change("body", value)} disabled={pending || !ready} /></div>
      <div className="form-actions">
        <button className="button" type="submit" disabled={coverBusy || bodyBusy}>{pending ? "Menyimpan…" : postId ? "Simpan perubahan" : "Buat tulisan"}</button>
        {postId && <a className="text-link" href={`/admin/posts/${postId}/preview`} target="_blank" rel="noopener noreferrer">Preview tersimpan ↗</a>}
        <a className="text-link" href="/admin">Batal</a>
      </div>
    </fieldset>
    <p className="editor-help">Simpan untuk memperbarui website dan preview. Cadangan browser tidak menerbitkan tulisan dan tidak tersinkron ke perangkat lain.</p>
  </form>;
}
