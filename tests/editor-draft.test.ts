import assert from "node:assert/strict";
import test from "node:test";
import { draftKey, readBackup, sameDraft, type DraftFields } from "../lib/editor-draft";
const fields: DraftFields = { title: "Judul", slug: "judul", excerpt: "", category: "Cerita", status: "draft", cover_url: "", body: "<p>Isi</p>" };
test("backups are separated by account and article", () => {
  assert.notEqual(draftKey("a", "post"), draftKey("b", "post"));
  assert.notEqual(draftKey("a"), draftKey("a", "post"));
});
test("malformed, obsolete and incomplete backups are rejected", () => {
  for (const raw of [null, "broken", "{}", JSON.stringify({version: 2, updatedAt: 1, fields}), JSON.stringify({version: 1, updatedAt: 1, fields: {body: "text"}})]) assert.equal(readBackup(raw), null);
});
test("valid backups preserve content and compare every editable field", () => {
  assert.deepEqual(readBackup(JSON.stringify({version: 1, updatedAt: 1, fields}))?.fields, fields);
  assert.equal(sameDraft(fields, {...fields}), true);
  for (const key of Object.keys(fields)) assert.equal(sameDraft(fields, {...fields, [key]: "changed"}), false);
});
