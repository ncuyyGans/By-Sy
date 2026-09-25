-- Hapus copy tambahan yang tidak diperlukan pada halaman About.
alter table public.about_page drop column if exists title;
alter table public.about_page drop column if exists lead;
