import { createClient } from "@/lib/supabase/server";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: "Cerita" | "Opini" | "Catatan Belajar" | "Visual";
  body: string;
  cover_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  name: string;
  intro: string;
  email: string;
  footer: string;
};

export const defaultSettings: SiteSettings = {
  name: "Sy",
  intro: "Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.",
  email: "hello@example.com",
  footer: "Dibuat pelan-pelan oleh Sy.",
};

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [] as Post[];
  }
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as Post | null;
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("name, intro, email, footer")
    .eq("id", 1)
    .maybeSingle();
  return (data as SiteSettings | null) ?? defaultSettings;
}

export function formatDate(date: string | null) {
  if (!date) return "Belum diterbitkan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} menit baca`;
}
