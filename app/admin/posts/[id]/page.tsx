import { notFound } from "next/navigation";
import { updatePost } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { PostForm } from "@/components/post-form";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/data";

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <AdminShell title="Edit tulisan"><PostForm action={updatePost} post={data as Post} error={error} /></AdminShell>;
}
