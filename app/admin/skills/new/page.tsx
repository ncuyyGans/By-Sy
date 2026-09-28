import { createSkill } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { SkillForm } from "@/components/skill-form";

export default async function NewSkillPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <AdminShell title="Skill baru"><SkillForm action={createSkill} error={error} /></AdminShell>; }
