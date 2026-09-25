import { notFound } from "next/navigation";
import { updateProject } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { ProjectForm } from "@/components/project-form";
import type { Project } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <AdminShell title="Edit project"><ProjectForm action={updateProject} project={data as Project} error={error} /></AdminShell>;
}
