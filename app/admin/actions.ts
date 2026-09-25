"use server";

import { articleHtml } from "@/lib/article-html";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function slugify(input: string) { return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
async function requireUser() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/admin/login"); return supabase; }

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: value(formData, "email"), password: value(formData, "password") });
  if (error) redirect(`/admin/login?error=${encodeURIComponent("Email atau password tidak cocok.")}`);
  redirect("/admin");
}
export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/admin/login"); }
export async function createPost(formData: FormData) {
  const supabase = await requireUser(); const title = value(formData, "title"); const status = value(formData, "status") === "published" ? "published" : "draft"; const slug = slugify(value(formData, "slug") || title);
  const { error } = await supabase.from("posts").insert({ title, slug, excerpt: value(formData, "excerpt"), category: value(formData, "category"), body: articleHtml(value(formData, "body")), cover_url: value(formData, "cover_url") || null, status, published_at: status === "published" ? new Date().toISOString() : null });
  if (error) redirect(`/admin/posts/new?error=${encodeURIComponent(error.message)}`); revalidatePath("/"); revalidatePath("/blog"); redirect("/admin");
}
export async function updatePost(formData: FormData) {
  const supabase = await requireUser(); const id = value(formData, "id"); const title = value(formData, "title"); const status = value(formData, "status") === "published" ? "published" : "draft"; const publishedAt = value(formData, "published_at");
  const { error } = await supabase.from("posts").update({ title, slug: slugify(value(formData, "slug") || title), excerpt: value(formData, "excerpt"), category: value(formData, "category"), body: articleHtml(value(formData, "body")), cover_url: value(formData, "cover_url") || null, status, published_at: status === "published" ? (publishedAt || new Date().toISOString()) : null, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) redirect(`/admin/posts/${id}?error=${encodeURIComponent(error.message)}`); revalidatePath("/"); revalidatePath("/blog"); redirect("/admin");
}
export async function deletePost(formData: FormData) { const supabase = await requireUser(); await supabase.from("posts").delete().eq("id", value(formData, "id")); revalidatePath("/"); revalidatePath("/blog"); redirect("/admin"); }
export async function updateSettings(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("site_settings").upsert({ id: 1, name: value(formData, "name"), intro: value(formData, "intro"), email: value(formData, "email"), footer: value(formData, "footer"), role: value(formData, "role"), location: value(formData, "location"), github_url: value(formData, "github_url"), instagram_url: value(formData, "instagram_url"), x_url: value(formData, "x_url"), updated_at: new Date().toISOString() });
  revalidatePath("/"); revalidatePath("/blog"); redirect("/admin?saved=1");
}
