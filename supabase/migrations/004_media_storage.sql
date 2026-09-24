-- Jalankan satu kali setelah migration 003.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog media is publicly readable" on storage.objects;
create policy "blog media is publicly readable"
on storage.objects for select
using (bucket_id = 'blog-media');

drop policy if exists "authenticated users upload blog media" on storage.objects;
create policy "authenticated users upload blog media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-media');

drop policy if exists "authenticated users update blog media" on storage.objects;
create policy "authenticated users update blog media"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-media')
with check (bucket_id = 'blog-media');

drop policy if exists "authenticated users delete blog media" on storage.objects;
create policy "authenticated users delete blog media"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-media');
