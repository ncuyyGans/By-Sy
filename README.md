# By-Sy

Website personal dan blog minimal untuk Sy, dibangun dengan Next.js, Supabase, dan Vercel.

## Fitur

- Homepage dan arsip blog publik
- Detail artikel dan reading time
- Login admin email/password di `/admin/login`
- Admin privat dengan Supabase Auth
- Buat, edit, hapus, draft, dan publish tulisan
- Pengaturan nama, intro, email, dan footer
- Row Level Security di Supabase

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Setup database

1. Jalankan `supabase/schema.sql` di Supabase SQL Editor.
2. Jalankan `supabase/migrations/002_admin_cms.sql`.
3. Di Supabase buka Authentication → Users → Add user, lalu buat akun admin email/password.
4. Tambahkan environment variables ke Vercel dan redeploy.

## Lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```
