import assert from "node:assert/strict";
import test from "node:test";
import { articleHtml } from "../lib/article-html";

test("preserves editor formatting and uploaded images", () => {
  const html = '<h2>Judul</h2><p><b>Tebal</b> <i>Miring</i><br /></p><blockquote>Kutipan</blockquote><ul><li>Catatan</li></ul><a href="https://example.com">Link</a><img src="https://example.com/image.webp" alt="Foto" />';
  assert.equal(articleHtml(html), html);
});

test("keeps legacy plain text readable and escapes markup characters", () => {
  assert.equal(articleHtml('Aku & kamu\nbaris kedua\n\n2 < 3 > 1'), '<p>Aku &amp; kamu<br />baris kedua</p><p>2 &lt; 3 &gt; 1</p>');
});

test("removes active HTML, embedded documents, styles, and handlers", () => {
  assert.equal(articleHtml('<script>alert(1)</script><iframe src="https://evil.example"></iframe><p style="color:red" onclick="alert(1)">Aman</p><img src="https://example.com/a.jpg" onerror="alert(1)">'), '<p>Aman</p><img src="https://example.com/a.jpg" />');
});

test("rejects encoded script links, data images and protocol-relative URLs", () => {
  for (const url of ['javascript:alert(1)', 'jav&#x61;script:alert(1)', '//evil.example', 'data:text/html,evil']) {
    assert.equal(articleHtml(`<a href="${url}">Link</a>`), '<a>Link</a>');
  }
  assert.equal(articleHtml('<img src="data:image/svg+xml,bad"><img src="mailto:test@example.com">'), '<img /><img />');
});

test("preserves safe relative and mail links; repeated sanitization is stable", () => {
  const html = '<p><a href="/blog">Blog</a><a href="mailto:sy@example.com">Email</a></p>';
  assert.equal(articleHtml(html), html);
  assert.equal(articleHtml(articleHtml(html)), html);
});
