alter table public.site_settings
add column if not exists facebook_url text not null default '',
add column if not exists linkedin_url text not null default '';
