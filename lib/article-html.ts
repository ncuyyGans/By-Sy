import sanitizeHtml from "sanitize-html";

/** Shared server-side policy for saved content and legacy article rendering. */
export function articleHtml(body: string): string {
  const html = /<[a-z][\s\S]*>/i.test(body)
    ? body
    : body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .split(/\n\n+/).map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`).join("");

  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "div", "h2", "h3", "strong", "b", "em", "i", "u", "s", "blockquote", "ul", "ol", "li", "a", "img", "pre", "code", "hr"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
  });
}
