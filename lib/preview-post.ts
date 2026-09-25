import type { SupabaseClient } from "@supabase/supabase-js";
import type { Post } from "./data";

export async function loadPreviewPost(supabase: SupabaseClient, id: string) {
  // Verify with Auth before reading any unpublished content, even without middleware.
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { kind: "unauthorized" } as const;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { kind: "not-found" } as const;
  }
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Preview tidak dapat dimuat. Coba lagi nanti.");
  if (!data) return { kind: "not-found" } as const;
  return { kind: "ok", post: data as Post } as const;
}
