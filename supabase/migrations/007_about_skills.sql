alter table public.about_page
add column if not exists skills_label text not null default 'Aplikasi & tools';

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null default '',
  logo_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.skills (name, level, logo_url, sort_order)
select * from (values
  ('Canva', 'Mahir', 'https://cdn.simpleicons.org/canva/00C4CC', 0),
  ('Figma', 'Menengah', 'https://cdn.simpleicons.org/figma/F24E1E', 1),
  ('Notion', 'Sering digunakan', 'https://cdn.simpleicons.org/notion/000000', 2),
  ('VS Code', 'Menengah', 'https://cdn.simpleicons.org/visualstudiocode/007ACC', 3)
) as seed(name, level, logo_url, sort_order)
where not exists (select 1 from public.skills);

alter table public.skills enable row level security;
drop policy if exists "visible skills are public" on public.skills;
create policy "visible skills are public" on public.skills for select using (visible = true);
drop policy if exists "authenticated users manage skills" on public.skills;
create policy "authenticated users manage skills" on public.skills for all to authenticated using (true) with check (true);
