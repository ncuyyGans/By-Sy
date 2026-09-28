import { notFound } from "next/navigation";
import { updateSkill } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { SkillForm } from "@/components/skill-form";
import type { Skill } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function EditSkillPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) { const [{ id }, { error }] = await Promise.all([params, searchParams]); const supabase = await createClient(); const { data } = await supabase.from("skills").select("*").eq("id", id).maybeSingle(); if (!data) notFound(); return <AdminShell title="Edit skill"><SkillForm action={updateSkill} skill={data as Skill} error={error} /></AdminShell>; }
