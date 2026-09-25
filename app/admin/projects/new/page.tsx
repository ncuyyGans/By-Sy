import { createProject } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AdminShell title="Project baru"><ProjectForm action={createProject} error={error} /></AdminShell>;
}
