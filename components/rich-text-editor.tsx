"use client";

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function plainTextFromHtml(value: string) {
  if (!value || !/<[a-z][\\s\\S]*>/i.test(value)) return value;
  return decodeEntities(
    value
      .replace(/<br\\s*\\/?>/gi, "\\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<\\/(p|h[1-6]|blockquote|li|pre|div)>/gi, "\\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \\t]+\\n/g, "\\n")
    .replace(/\\n{3,}/g, "\\n\\n")
    .trim();
}

export function RichTextEditor({ defaultValue = "", onChange, onBusyChange: _onBusyChange, disabled = false }: {
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useStateValue(defaultValue);

  function update(value: string) {
    setText(value);
    onChange?.(value);
  }

  return <div className="rich-editor">
    <textarea
      name="body"
      className="editor-canvas"
      role="textbox"
      aria-labelledby="body-label"
      aria-multiline="true"
      value={text}
      onChange={(event) => update(event.target.value)}
      disabled={disabled}
      placeholder="Tulis isi artikel di sini..."
    />
    <p className="editor-help">Editor teks sederhana. Gunakan baris kosong untuk memisahkan paragraf.</p>
  </div>;
}

function useStateValue(initialValue: string) {
  const [value, setValue] = React.useState(() => plainTextFromHtml(initialValue));
  return [value, setValue] as const;
}

import React from "react";
