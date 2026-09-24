-- Jalankan satu kali setelah 002_admin_cms.sql.
alter table public.site_settings
  add column if not exists role text not null default 'Writer, learner, and internet wanderer.',
  add column if not exists location text not null default 'Cirebon, Indonesia',
  add column if not exists github_url text not null default 'https://github.com/ncuyyGans',
  add column if not exists instagram_url text not null default '',
  add column if not exists x_url text not null default '';
