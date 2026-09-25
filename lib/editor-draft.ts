export const draftFields = ["title", "slug", "excerpt", "category", "status", "cover_url", "body"] as const;
export type DraftFields = Record<(typeof draftFields)[number], string>;
export type DraftBackup = { version: 1; updatedAt: number; fields: DraftFields };
export type SavePostResult = { error: string } | { saved: true };
export function draftKey(userId: string, postId?: string) {
  return `by-sy:draft:v1:${userId}:${postId ?? "new"}`;
}
export function readBackup(raw: string | null): DraftBackup | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (value?.version !== 1 || !Number.isFinite(value.updatedAt) || !value.fields) return null;
    if (!draftFields.every((key) => typeof value.fields[key] === "string")) return null;
    if (!["draft", "published"].includes(value.fields.status)) return null;
    if (!["Cerita", "Opini", "Catatan Belajar", "Visual"].includes(value.fields.category)) return null;
    return { version: 1, updatedAt: value.updatedAt, fields: Object.fromEntries(draftFields.map(key => [key, value.fields[key]])) as DraftFields };
  } catch { return null; }
}
export function sameDraft(a: DraftFields, b: DraftFields) {
  return draftFields.every(key => a[key] === b[key]);
}
