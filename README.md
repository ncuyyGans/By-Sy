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
3. Jalankan `supabase/migrations/003_profile_fields.sql`.
4. Jalankan `supabase/migrations/004_media_storage.sql` untuk bucket gambar.
5. Di Supabase buka Authentication → Users → Add user, lalu buat akun admin email/password.
6. Tambahkan environment variables ke Vercel dan redeploy.

## Lokal

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Pemeriksaan sebelum merge

Gunakan Node.js 22 atau lebih baru. Dependency dikunci dalam `package-lock.json`.

```bash
npm ci
npm test
npm run typecheck
npm run build
```

GitHub Actions menjalankan pemeriksaan tersebut pada pull request dan push ke `main`.
Build tidak memerlukan kredensial produksi; pengujian login, database, dan upload
memerlukan konfigurasi Supabase pada environment pengujian.

HTML artikel dibersihkan di server saat disimpan, dibaca publik, dan dibuka kembali
di editor. Heading, daftar, kutipan, link HTTP(S)/email, dan gambar HTTP(S) didukung;
script, iframe, event handler, CSS inline, dan URL berbahaya dihapus. Tulisan teks
lama tetap didukung. Tidak ada migrasi database baru untuk perubahan ini.

## Preview draft

Simpan draft, buka kembali halaman edit, lalu klik **Preview tersimpan ↗**.
Preview terbuka di tab baru dengan tampilan artikel publik. Halaman ini memerlukan
login admin, menampilkan versi terakhir yang tersimpan, dan tidak menerbitkan tulisan.
Perubahan yang belum disimpan belum terlihat di preview.

## Cadangan otomatis editor

Editor menyimpan cadangan lokal setelah 800 ms tanpa perubahan, terpisah per akun
serta artikel. Saat membuka editor kembali, pilih **Pulihkan cadangan** atau
**Gunakan versi website**. Cadangan tidak memublikasikan artikel dan tidak tersinkron
antarperangkat. Simpan manual tetap diperlukan; cadangan dihapus setelah server
mengonfirmasi penyimpanan berhasil. Jika penyimpanan gagal, isi editor dipertahankan.

Browser dapat membatasi peringatan saat tab ditutup, dan menghapus data browser
juga menghapus cadangan. Hindari mengedit artikel yang sama di beberapa tab sekaligus.
