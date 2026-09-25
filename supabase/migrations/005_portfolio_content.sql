-- Jalankan setelah 004_media_storage.sql.

create table if not exists public.about_page (
  id integer primary key check (id = 1),
  eyebrow text not null default 'About me',
  title text not null default 'Ruang untuk berpikir, membuat, dan berbagi.',
  lead text not null default 'Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.',
  story_label text not null default 'Sedikit tentangku',
  story_title text not null default 'Sy',
  story_body text not null default 'Aku adalah writer, learner, and internet wanderer yang tinggal di Cirebon, Indonesia. Website ini adalah rumah digital untuk menyimpan proses, membagikan hal yang kupelajari, dan mengenalkan karya yang sedang kubangun.',
  story_body_2 text not null default 'Aku percaya personal branding tidak harus terasa seperti iklan. Ia bisa tumbuh dari tulisan yang jujur, karya yang dikerjakan dengan baik, dan jejak proses yang bisa dilihat orang lain.',
  focus_label text not null default 'Yang sedang kubangun',
  focus_1 text not null default 'Cerita dan catatan yang layak disimpan.',
  focus_2 text not null default 'Eksperimen digital yang berguna dan terasa personal.',
  focus_3 text not null default 'Portofolio yang menunjukkan cara berpikir, bukan hanya hasil akhir.',
  links_label text not null default 'Temukan aku',
  cta_label text not null default 'Lihat lebih dekat',
  cta_title text not null default 'Kenalan lewat karya.',
  cta_button_label text not null default 'Lihat project & karya',
  updated_at timestamptz not null default now()
);

insert into public.about_page (id) values (1)
on conflict (id) do nothing;

alter table public.about_page enable row level security;
drop policy if exists "about page is public" on public.about_page;
create policy "about page is public" on public.about_page for select using (true);
drop policy if exists "authenticated users manage about page" on public.about_page;
create policy "authenticated users manage about page" on public.about_page for all to authenticated using (true) with check (true);

create table if not exists public.projects_page (
  id integer primary key check (id = 1),
  eyebrow text not null default 'Selected work',
  title text not null default 'Projects & karya.',
  lead text not null default 'Beberapa hal yang sedang dan pernah kubangun—dari rumah digital sampai eksperimen kecil yang membantu proses belajar.',
  note_label text not null default 'Sedang bertumbuh',
  note_body text not null default 'Halaman ini akan terus diisi seiring bertambahnya karya, eksperimen, dan project yang ingin kubagikan.',
  updated_at timestamptz not null default now()
);

insert into public.projects_page (id) values (1)
on conflict (id) do nothing;

alter table public.projects_page enable row level security;
drop policy if exists "projects page is public" on public.projects_page;
create policy "projects page is public" on public.projects_page for select using (true);
drop policy if exists "authenticated users manage projects page" on public.projects_page;
create policy "authenticated users manage projects page" on public.projects_page for all to authenticated using (true) with check (true);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  eyebrow text not null default 'Project',
  year text not null default '2026',
  description text not null default '',
  url text not null,
  repo_url text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.projects (title, eyebrow, year, description, url, repo_url, tags, sort_order)
select 'By-Sy', 'Personal journal & blog', '2026', 'Ruang personal untuk cerita, opini, catatan belajar, dan visual—dibangun sebagai rumah digital yang terus tumbuh.', 'https://by-sy.vercel.app', 'https://github.com/ncuyyGans/By-Sy', array['Next.js', 'Supabase', 'Writing'], 0
where not exists (select 1 from public.projects where title = 'By-Sy');

alter table public.projects enable row level security;
drop policy if exists "visible projects are public" on public.projects;
create policy "visible projects are public" on public.projects for select using (visible = true);
drop policy if exists "authenticated users manage projects" on public.projects;
create policy "authenticated users manage projects" on public.projects for all to authenticated using (true) with check (true);
