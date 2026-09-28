export type SocialIconName = "github" | "instagram" | "x" | "email";

export function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.2c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.68 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.11-3.07 0 0 .98-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.18-1.49 3.15-1.18 3.15-1.18.64 1.59.24 2.77.12 3.07.74.81 1.19 1.84 1.19 3.1 0 4.4-2.72 5.38-5.31 5.67.42.36.79 1.07.79 2.17v3.21c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>;
  if (name === "x") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h4.7l4.1 5.5L17.6 3H20l-6.1 7.3L20.5 21h-4.7l-4.6-6.2L5.9 21H3.5l6.6-8L4 3Zm3.5 1.8 9.2 14.4h1.8L9.3 4.8H7.5Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
}
