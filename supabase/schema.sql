create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text not null check (category in ('Cerita', 'Opini', 'Catatan Belajar', 'Visual')),
  body text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;
create policy "published posts are public" on public.posts for select using (status = 'published');
