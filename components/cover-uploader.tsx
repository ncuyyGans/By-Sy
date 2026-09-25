"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";

export function CoverUploader({ defaultValue = "", onChange, onBusyChange }: { defaultValue?: string; onChange?: (value: string) => void; onBusyChange?: (busy: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateUrl(value: string) { setUrl(value); onChange?.(value); }

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true); onBusyChange?.(true); setError("");
    try { updateUrl(await uploadImage(file)); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Upload gagal."); }
    finally { setBusy(false); onBusyChange?.(false); }
  }

  return <div className="cover-uploader"><input type="hidden" name="cover_url" value={url} />{url ? <div className="cover-preview"><img src={url} alt="Preview cover" /><button type="button" className="media-remove" onClick={() => updateUrl("")}>Hapus cover</button></div> : <button type="button" className="upload-zone" onClick={() => inputRef.current?.click()} disabled={busy}><span>{busy ? "Mengunggah…" : "Upload cover image"}</span><small>JPG, PNG, WEBP, atau GIF · Maks. 10 MB</small></button>}<input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => handleFile(event.target.files?.[0])} />{error && <div className="form-error">{error}</div>}</div>;
}
