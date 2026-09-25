import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { loadPreviewPost } from "../lib/preview-post";

const id = "12345678-1234-1234-1234-123456789abc";
function fixture(rows: unknown[] = [], status = 200) {
  const requests: { url: URL; method: string }[] = [];
  const client = createClient("https://preview-test.example", "test-publishable-key", {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: async (input, init) => {
      requests.push({ url: new URL(String(input)), method: init?.method ?? "GET" });
      return new Response(JSON.stringify(rows), { status, headers: { "content-type": "application/json" } });
    } },
  });
  return { client, requests };
}
function signedIn(t: TestContext, client: SupabaseClient) {
  t.mock.method(client.auth, "getUser", async () => ({ data: { user: { id: "admin" } as User }, error: null }));
}

test("logged-out visitors cannot query draft content", async () => {
  const { client, requests } = fixture();
  assert.deepEqual(await loadPreviewPost(client, id), { kind: "unauthorized" });
  assert.equal(requests.length, 0);
});

test("authenticated preview reads the saved draft without publishing", async (t) => {
  const post = { id, title: "Draft privat", status: "draft", body: "Isi draft" };
  const { client, requests } = fixture([post]);
  signedIn(t, client);
  assert.deepEqual(await loadPreviewPost(client, id), { kind: "ok", post });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, "GET");
  assert.equal(requests[0].url.searchParams.get("id"), `eq.${id}`);
  assert.equal(requests[0].url.searchParams.has("status"), false);
});

test("invalid IDs do not reach the database", async (t) => {
  const { client, requests } = fixture();
  signedIn(t, client);
  assert.deepEqual(await loadPreviewPost(client, "not-a-uuid"), { kind: "not-found" });
  assert.equal(requests.length, 0);
});

test("missing or inaccessible posts return not-found", async (t) => {
  const { client } = fixture();
  signedIn(t, client);
  assert.deepEqual(await loadPreviewPost(client, id), { kind: "not-found" });
});

test("database failures are not disguised as missing posts", async (t) => {
  const { client } = fixture([], 403);
  signedIn(t, client);
  await assert.rejects(loadPreviewPost(client, id), /Preview tidak dapat dimuat/);
});
