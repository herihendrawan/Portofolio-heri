# Portofolio Website — Heri

Website portofolio dengan CMS untuk upload project (Web Dev, AI Automation/n8n, Lainnya). Stack: **Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion + Supabase**. Tema visual: dark cyberpunk dengan efek glow.

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → jalankan seluruh isi file `supabase/schema.sql`. Ini akan membuat:
   - Tabel `projects`
   - Row Level Security (publik hanya bisa baca, hanya admin login yang bisa tulis)
   - Storage bucket `project-images` (untuk upload gambar cover)
   - 1 contoh data project
3. Buat akun admin: buka **Authentication → Users → Add user**, isi email & password kamu sendiri. Akun ini yang dipakai untuk login ke `/admin/login`.

## 2. Konfigurasi environment

Salin `.env.local.example` menjadi `.env.local`, lalu isi dengan kredensial dari **Project Settings → API** di Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Jalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 untuk halaman publik, dan http://localhost:3000/admin/login untuk masuk ke CMS.

## 4. Struktur project

```
app/
  page.js                  -> Halaman utama (hero + grid proyek)
  proyek/[slug]/page.js    -> Halaman detail proyek
  admin/login/page.js      -> Login admin
  admin/dashboard/page.js  -> CMS: tambah/edit/hapus proyek
components/
  Hero.js, Navbar.js, Footer.js
  ProjectCard.js, ProjectsExplorer.js   -> Grid + filter kategori (animasi)
  admin/DashboardClient.js, admin/ProjectForm.js
lib/
  supabase/client.js, server.js, middleware.js
  categories.js, slugify.js
supabase/schema.sql        -> Jalankan sekali di SQL Editor Supabase
middleware.js               -> Melindungi /admin agar wajib login
```

## 5. Cara pakai CMS

1. Login di `/admin/login`.
2. Klik "Tambah Proyek" -> isi judul, kategori, ringkasan, deskripsi, tech stack (pisahkan koma), link demo/repo (opsional), upload gambar cover (opsional).
3. Slug URL otomatis dibuat dari judul, tapi bisa diedit manual.
4. "Urutan tampil" - angka lebih besar akan muncul lebih dulu di grid.
5. Project langsung muncul di halaman utama setelah disimpan (tidak perlu redeploy).

### Kategori sekarang dinamis

Kategori (Web Dev, AI Automation, Lainnya, dst) disimpan di tabel `categories` dan bisa dikelola langsung dari CMS:

1. Di dashboard, klik tombol **Kelola Kategori**.
2. Isi nama kategori baru (mis. "Data Science" atau "Machine Learning") dan pilih warna aksennya (cyan/magenta/violet).
3. Kategori baru langsung muncul di dropdown form proyek dan di tab filter halaman utama.
4. Kategori yang masih dipakai oleh proyek tidak bisa dihapus — pindahkan dulu proyeknya ke kategori lain.

**Kalau project ini sudah pernah kamu deploy sebelumnya** (sebelum fitur kategori dinamis ada), jalankan `supabase/migration_dynamic_categories.sql` sekali di SQL Editor Supabase. Untuk instalasi baru, `supabase/schema.sql` sudah termasuk tabel kategori.

### Konten hero & tombol WhatsApp bisa diedit dari CMS

Di dashboard, klik tombol **Kelola Konten** untuk mengubah:
- Label kecil, judul utama (termasuk bagian yang menyala cyan), dan deskripsi di hero
- Teks kedua tombol CTA
- Nomor WhatsApp dan pesan otomatis untuk tombol chat mengambang (bisa dimatikan lewat toggle "Tampilkan tombol chat WhatsApp")

**Kalau project sudah pernah di-deploy sebelumnya**, jalankan `supabase/migration_site_settings.sql` sekali di SQL Editor Supabase. Untuk instalasi baru, `supabase/schema.sql` sudah termasuk tabel ini.

Nomor WhatsApp ditulis dengan kode negara tanpa `+` atau spasi, contoh: `6281234567890` untuk nomor Indonesia `081234567890`.

## 6. Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Import repo di vercel.com.
3. Tambahkan environment variable yang sama seperti di `.env.local` pada Vercel Project Settings.
4. Deploy.

## Catatan animasi & desain

- Palet warna: dark navy (--color-void) dengan aksen cyan/magenta/violet dan efek glow (box-shadow + text-shadow).
- Font: Chakra Petch (judul/display) + Inter (body).
- Animasi: reveal bertahap di hero (satu momen saat halaman dibuka), transisi grid saat filter kategori diganti (Framer Motion layout + AnimatePresence), efek hover glow di kartu project.
- Menghormati prefers-reduced-motion untuk pengguna yang menonaktifkan animasi di sistemnya.
