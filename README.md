# By-Sy

Template awal website personal/blog untuk Sy.

## Status

Repo sebelumnya kosong, jadi proyek ini dimulai dari scaffold baru. Versi pertama berisi:

- Homepage personal minimal
- Blog archive
- Detail artikel
- Kategori Cerita, Opini, Catatan Belajar, Visual
- Admin panel template di `/admin`
- Skema awal Supabase di `supabase/schema.sql`
- Struktur siap dideploy ke Vercel

## Menjalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Admin panel saat ini masih mode template/browser-session. Tahap berikutnya adalah menghubungkan login email/password, database artikel, upload media, dan pengaturan website ke Supabase.
