"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-image";

function initialHtml(value: string) {
  if (!value) return "<p><br></p>";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.split(/\n\n+/).map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
}

export function RichTextEditor({ defaultValue = "" }: { defaultValue?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(() => initialHtml(defaultValue));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function sync() { setHtml(editorRef.current?.innerHTML ?? ""); }
  function command(name: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(name, false, commandValue);
    sync();
  }
  function addLink() {
    const url = window.prompt("Masukkan URL link:", "https://");
    if (url) command("createLink", url);
  }
  async function addImage(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const url = await uploadImage(file);
      command("insertImage", url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload gagal.");
    } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  return <div className="rich-editor"><input type="hidden" name="body" value={html} /><div className="editor-toolbar" role="toolbar" aria-label="Format artikel"><button type="button" onMouseDown={(e) => { e.preventDefault(); command("formatBlock", "h2"); }}>H2</button><button type="button" onMouseDown={(e) => { e.preventDefault(); command("formatBlock", "h3"); }}>H3</button><button type="button" onMouseDown={(e) => { e.preventDefault(); command("formatBlock", "p"); }}>P</button><span /><button type="button" onMouseDown={(e) => { e.preventDefault(); command("bold"); }}><b>B</b></button><button type="button" onMouseDown={(e) => { e.preventDefault(); command("italic"); }}><i>I</i></button><button type="button" onMouseDown={(e) => { e.preventDefault(); command("formatBlock", "blockquote"); }}>“”</button><button type="button" onMouseDown={(e) => { e.preventDefault(); command("insertUnorderedList"); }}>• List</button><button type="button" onMouseDown={(e) => { e.preventDefault(); addLink(); }}>Link</button><button type="button" onMouseDown={(e) => { e.preventDefault(); fileRef.current?.click(); }}>{uploading ? "Uploading…" : "Image"}</button></div><div ref={editorRef} className="editor-canvas" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: html }} onInput={sync} /><input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => addImage(event.target.files?.[0])} />{error && <div className="form-error editor-error">{error}</div>}<p className="editor-help">Gunakan toolbar untuk heading, format teks, link, list, quote, dan gambar di dalam artikel.</p></div>;
}
