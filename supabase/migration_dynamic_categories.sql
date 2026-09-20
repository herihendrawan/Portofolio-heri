-- ============================================================
-- MIGRASI: Kategori Dinamis
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- (untuk project yang SUDAH pernah menjalankan schema.sql sebelumnya)
-- ============================================================

-- 1. Tabel kategori
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  value text not null unique,
  label text not null,
  accent text not null default 'cyan' check (accent in ('cyan', 'magenta', 'violet')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert categories" on public.categories;
create policy "Authenticated can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update categories" on public.categories;
create policy "Authenticated can update categories"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete categories" on public.categories;
create policy "Authenticated can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

-- 2. Isi kategori yang sudah ada sebelumnya (biar project lama tidak error)
insert into public.categories (value, label, accent, sort_order) values
  ('web-dev', 'Web Dev', 'cyan', 300),
  ('ai-automation', 'AI Automation', 'magenta', 200),
  ('lainnya', 'Lainnya', 'violet', 100)
on conflict (value) do nothing;

-- 3. Lepas batasan lama di kolom projects.category (fixed enum)
alter table public.projects drop constraint if exists projects_category_check;

-- 4. Hubungkan projects.category ke categories.value (integrity + cascade rename)
alter table public.projects
  add constraint projects_category_fkey
  foreign key (category) references public.categories(value)
  on update cascade
  on delete restrict;

-- Setelah ini, tambah/ubah/hapus kategori cukup lewat CMS (menu "Kelola Kategori"),
-- tidak perlu lagi edit SQL.
