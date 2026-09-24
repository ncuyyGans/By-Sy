"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";

export function CoverUploader({ defaultValue = "" }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true); setError("");
    try { setUrl(await uploadImage(file)); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Upload gagal."); }
    finally { setBusy(false); }
  }

  return <div className="cover-uploader"><input type="hidden" name="cover_url" value={url} />{url ? <div className="cover-preview"><img src={url} alt="Preview cover" /><button type="button" className="media-remove" onClick={() => setUrl("")}>Hapus cover</button></div> : <button type="button" className="upload-zone" onClick={() => inputRef.current?.click()} disabled={busy}><span>{busy ? "Mengunggah…" : "Upload cover image"}</span><small>JPG, PNG, WEBP, atau GIF · Maks. 10 MB</small></button>}<input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => handleFile(event.target.files?.[0])} />{error && <div className="form-error">{error}</div>}</div>;
}
