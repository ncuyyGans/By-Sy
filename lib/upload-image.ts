import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 10 MB.");

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi admin berakhir. Silakan login kembali.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "image";
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}.${extension}`;
  const { error } = await supabase.storage.from("blog-media").upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
  return data.publicUrl;
}
