"use server";

import type { SavePostResult } from "@/lib/editor-draft";
import { articleHtml } from "@/lib/article-html";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function slugify(input: string) { return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function tags(formData: FormData) { return value(formData, "tags").split(",").map(tag => tag.trim()).filter(Boolean); }
function visible(formData: FormData) { return formData.get("visible") === "on"; }
function sortOrder(formData: FormData) { const parsed = Number.parseInt(value(formData, "sort_order"), 10); return Number.isFinite(parsed) ? parsed : 0; }
async function requireUser() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/admin/login"); return supabase; }

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: value(formData, "email"), password: value(formData, "password") });
  if (error) redirect(`/admin/login?error=${encodeURIComponent("Email atau password tidak cocok.")}`);
  redirect("/admin");
}
export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/admin/login"); }
export async function createPost(formData: FormData): Promise<SavePostResult> {
  const supabase = await requireUser(); const title = value(formData, "title"); const status = value(formData, "status") === "published" ? "published" : "draft"; const slug = slugify(value(formData, "slug") || title);
  if (!title || !slug) return { error: "Judul dan slug harus diisi." };
  const { error } = await supabase.from("posts").insert({ title, slug, excerpt: value(formData, "excerpt"), category: value(formData, "category"), body: articleHtml(value(formData, "body")), cover_url: value(formData, "cover_url") || null, status, published_at: status === "published" ? new Date().toISOString() : null });
  if (error) return { error: error.code === "23505" ? "Slug sudah digunakan. Pilih slug lain lalu simpan kembali." : "Tulisan belum berhasil disimpan. Coba lagi." }; revalidatePath("/"); revalidatePath("/blog"); return { saved: true };
}
export async function updatePost(formData: FormData): Promise<SavePostResult> {
  const supabase = await requireUser(); const id = value(formData, "id"); const title = value(formData, "title"); const status = value(formData, "status") === "published" ? "published" : "draft"; const publishedAt = value(formData, "published_at");
  if (!title || !slugify(value(formData, "slug") || title)) return { error: "Judul dan slug harus diisi." };
  const { data, error } = await supabase.from("posts").update({ title, slug: slugify(value(formData, "slug") || title), excerpt: value(formData, "excerpt"), category: value(formData, "category"), body: articleHtml(value(formData, "body")), cover_url: value(formData, "cover_url") || null, status, published_at: status === "published" ? (publishedAt || new Date().toISOString()) : null, updated_at: new Date().toISOString() }).eq("id", id).select("id").maybeSingle();
  if (error || !data) return { error: error?.code === "23505" ? "Slug sudah digunakan. Pilih slug lain lalu simpan kembali." : "Tulisan belum berhasil disimpan. Coba lagi." }; revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/blog/[slug]", "page"); return { saved: true };
}
export async function deletePost(formData: FormData) { const supabase = await requireUser(); await supabase.from("posts").delete().eq("id", value(formData, "id")); revalidatePath("/"); revalidatePath("/blog"); redirect("/admin"); }
export async function updateSettings(formData: FormData) {
  const supabase = await requireUser();
  await supabase.from("site_settings").upsert({ id: 1, name: value(formData, "name"), intro: value(formData, "intro"), email: value(formData, "email"), footer: value(formData, "footer"), role: value(formData, "role"), location: value(formData, "location"), github_url: value(formData, "github_url"), instagram_url: value(formData, "instagram_url"), x_url: value(formData, "x_url"), updated_at: new Date().toISOString() });
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/about"); revalidatePath("/projects"); redirect("/admin?saved=1");
}

export async function updateAboutPage(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from("about_page").update({ eyebrow: value(formData, "eyebrow"), story_label: value(formData, "story_label"), story_title: value(formData, "story_title"), story_body: value(formData, "story_body"), story_body_2: value(formData, "story_body_2"), focus_label: value(formData, "focus_label"), focus_1: value(formData, "focus_1"), focus_2: value(formData, "focus_2"), focus_3: value(formData, "focus_3"), links_label: value(formData, "links_label"), cta_label: value(formData, "cta_label"), cta_title: value(formData, "cta_title"), cta_button_label: value(formData, "cta_button_label"), updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) redirect("/admin?error=about");
  revalidatePath("/about"); redirect("/admin?saved=about");
}

export async function updateProjectsPage(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from("projects_page").update({ eyebrow: value(formData, "eyebrow"), title: value(formData, "title"), lead: value(formData, "lead"), note_label: value(formData, "note_label"), note_body: value(formData, "note_body"), updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) redirect("/admin?error=projects-page");
  revalidatePath("/projects"); redirect("/admin?saved=projects-page");
}

export async function createProject(formData: FormData) {
  const supabase = await requireUser();
  const title = value(formData, "title"); const description = value(formData, "description"); const url = value(formData, "url");
  if (!title || !description || !url) redirect("/admin/projects/new?error=required");
  const { error } = await supabase.from("projects").insert({ title, eyebrow: value(formData, "eyebrow"), year: value(formData, "year"), description, url, repo_url: value(formData, "repo_url") || null, tags: tags(formData), sort_order: sortOrder(formData), visible: visible(formData) });
  if (error) redirect("/admin/projects/new?error=save");
  revalidatePath("/projects"); redirect("/admin?saved=project");
}

export async function updateProject(formData: FormData) {
  const supabase = await requireUser(); const id = value(formData, "id");
  const title = value(formData, "title"); const description = value(formData, "description"); const url = value(formData, "url");
  if (!title || !description || !url) redirect(`/admin/projects/${id}?error=required`);
  const { error } = await supabase.from("projects").update({ title, eyebrow: value(formData, "eyebrow"), year: value(formData, "year"), description, url, repo_url: value(formData, "repo_url") || null, tags: tags(formData), sort_order: sortOrder(formData), visible: visible(formData), updated_at: new Date().toISOString() }).eq("id", id);
  if (error) redirect(`/admin/projects/${id}?error=save`);
  revalidatePath("/projects"); redirect("/admin?saved=project");
}

export async function deleteProject(formData: FormData) {
  const supabase = await requireUser(); await supabase.from("projects").delete().eq("id", value(formData, "id"));
  revalidatePath("/projects"); redirect("/admin?saved=project-deleted");
}
