import { createPost } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { PostForm } from "@/components/post-form";

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AdminShell title="Tulisan baru"><PostForm action={createPost} error={error} /></AdminShell>;
}
