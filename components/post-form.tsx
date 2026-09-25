import { redirect } from "next/navigation";
import { articleHtml } from "@/lib/article-html";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/data";
import type { SavePostResult } from "@/lib/editor-draft";
import { PostEditor } from "@/components/post-editor";

export async function PostForm({ action, post, error }: {
  action: (formData: FormData) => Promise<SavePostResult>;
  post?: Post;
  error?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return <PostEditor key={`${user.id}:${post?.id ?? "new"}`} action={action} userId={user.id} postId={post?.id} publishedAt={post?.published_at ?? ""} error={error} initial={{
    title: post?.title ?? "", slug: post?.slug ?? "", excerpt: post?.excerpt ?? "",
    category: post?.category ?? "Cerita", status: post?.status ?? "draft",
    cover_url: post?.cover_url ?? "", body: articleHtml(post?.body ?? ""),
  }} />;
}
