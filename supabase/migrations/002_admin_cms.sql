-- Jalankan file ini satu kali di Supabase SQL Editor setelah schema.sql.

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  name text not null default 'Sy',
  intro text not null default 'Tempat kecil untuk cerita, pikiran, dan hal-hal yang sedang kupelajari.',
  email text not null default 'hello@example.com',
  footer text not null default 'Dibuat pelan-pelan oleh Sy.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site settings are public" on public.site_settings;
create policy "site settings are public"
on public.site_settings for select
using (true);

drop policy if exists "authenticated users manage settings" on public.site_settings;
create policy "authenticated users manage settings"
on public.site_settings for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated users manage posts" on public.posts;
create policy "authenticated users manage posts"
on public.posts for all
to authenticated
using (true)
with check (true);
