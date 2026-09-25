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
  role: string;
  location: string;
  github_url: string;
  instagram_url: string;
  x_url: string;
};

export type AboutPage = {
  id: number;
  eyebrow: string;
  story_label: string;
  story_title: string;
  story_body: string;
  story_body_2: string;
  focus_label: string;
  focus_1: string;
  focus_2: string;
  focus_3: string;
  links_label: string;
  cta_label: string;
  cta_title: string;
  cta_button_label: string;
};

export type ProjectsPage = {
  id: number;
  eyebrow: string;
  title: string;
  lead: string;
  note_label: string;
  note_body: string;
};

export type Project = {
  id: string;
  title: string;
  eyebrow: string;
  year: string;
  description: string;
  url: string;
  repo_url: string | null;
  tags: string[];
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export const defaultSettings: SiteSettings = {
  name: "Sy",
  intro: "Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.",
  email: "hello@example.com",
  footer: "Dibuat pelan-pelan oleh Sy.",
  role: "Writer, learner, and internet wanderer.",
  location: "Cirebon, Indonesia",
  github_url: "https://github.com/ncuyyGans",
  instagram_url: "",
  x_url: "",
};

export const defaultAboutPage: AboutPage = {
  id: 1,
  eyebrow: "About me",
  story_label: "Sedikit tentangku",
  story_title: defaultSettings.name,
  story_body: "Aku adalah writer, learner, and internet wanderer yang tinggal di Cirebon, Indonesia. Website ini adalah rumah digital untuk menyimpan proses, membagikan hal yang kupelajari, dan mengenalkan karya yang sedang kubangun.",
  story_body_2: "Aku percaya personal branding tidak harus terasa seperti iklan. Ia bisa tumbuh dari tulisan yang jujur, karya yang dikerjakan dengan baik, dan jejak proses yang bisa dilihat orang lain.",
  focus_label: "Yang sedang kubangun",
  focus_1: "Cerita dan catatan yang layak disimpan.",
  focus_2: "Eksperimen digital yang berguna dan terasa personal.",
  focus_3: "Portofolio yang menunjukkan cara berpikir, bukan hanya hasil akhir.",
  links_label: "Temukan aku",
  cta_label: "Lihat lebih dekat",
  cta_title: "Kenalan lewat karya.",
  cta_button_label: "Lihat project & karya",
};

export const defaultProjectsPage: ProjectsPage = {
  id: 1,
  eyebrow: "Selected work",
  title: "Projects & karya.",
  lead: "Beberapa hal yang sedang dan pernah kubangun—dari rumah digital sampai eksperimen kecil yang membantu proses belajar.",
  note_label: "Sedang bertumbuh",
  note_body: "Halaman ini akan terus diisi seiring bertambahnya karya, eksperimen, dan project yang ingin kubagikan.",
};

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    console.error("Failed to load posts:", error.message);
    return [] as Post[];
  }
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data as Post | null;
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("name, intro, email, footer, role, location, github_url, instagram_url, x_url").eq("id", 1).maybeSingle();
  return { ...defaultSettings, ...(data as Partial<SiteSettings> | null) };
}

export async function getAboutPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("about_page").select("*").eq("id", 1).maybeSingle();
  return { ...defaultAboutPage, ...(data as Partial<AboutPage> | null) };
}

export async function getProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects_page").select("*").eq("id", 1).maybeSingle();
  return { ...defaultProjectsPage, ...(data as Partial<ProjectsPage> | null) };
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("visible", true).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) {
    console.error("Failed to load projects:", error.message);
    return [] as Project[];
  }
  return (data ?? []) as Project[];
}

export function formatDate(date: string | null) {
  if (!date) return "Belum diterbitkan";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} menit`;
}
