-- ============================================================
-- SKEMA DATABASE: Portfolio Website
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabel kategori (dikelola dari CMS — bisa tambah/hapus sendiri)
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

insert into public.categories (value, label, accent, sort_order) values
  ('web-dev', 'Web Dev', 'cyan', 300),
  ('ai-automation', 'AI Automation', 'magenta', 200),
  ('lainnya', 'Lainnya', 'violet', 100)
on conflict (value) do nothing;

-- 2. Tabel utama untuk menyimpan setiap project portofolio
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null references public.categories(value) on update cascade on delete restrict,
  summary text not null,
  description text not null,
  cover_image_url text,
  tech_stack text[] default '{}',
  project_url text,
  repo_url text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_sort_order_idx on public.projects (sort_order desc);

-- 3. Trigger untuk auto-update kolom updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- 4. Row Level Security
alter table public.projects enable row level security;

-- Siapapun (pengunjung website) boleh membaca semua project
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

-- Hanya user yang sudah login (admin) yang boleh insert/update/delete
drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- ============================================================
-- 5. Storage bucket untuk gambar cover project
-- ============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated can upload project images" on storage.objects;
create policy "Authenticated can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can update project images" on storage.objects;
create policy "Authenticated can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated can delete project images" on storage.objects;
create policy "Authenticated can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- ============================================================
-- 6. Konten hero & tombol WhatsApp (baris tunggal, diedit dari CMS)
create table if not exists public.site_settings (
  id integer primary key default 1,
  hero_eyebrow text not null default 'Portofolio kerja — Heri',
  hero_headline text not null default 'Membangun web, automation, dan eksperimen',
  hero_headline_highlight text not null default 'yang benar-benar jalan.',
  hero_subtitle text not null default 'Kumpulan project full-stack web development, automation AI dengan n8n, dan berbagai eksperimen lain — sebagian besar dibangun dengan bantuan AI, dari ide sampai deploy.',
  cta_primary_label text not null default 'Lihat semua proyek',
  cta_secondary_label text not null default 'Tentang saya',
  whatsapp_number text not null default '6281234567890',
  whatsapp_message text not null default 'Halo, saya lihat portofolio kamu dan ingin diskusi project.',
  whatsapp_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can update site settings" on public.site_settings;
create policy "Authenticated can update site settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- 7. (Opsional) Contoh data awal — hapus/ubah sesuka hati
-- ============================================================
insert into public.projects (title, slug, category, summary, description, tech_stack, is_featured, sort_order)
values
  (
    'AmanahKopi',
    'amanahkopi',
    'web-dev',
    'Website coffee shop full-stack dengan CMS real-time.',
    'Website untuk bisnis kedai kopi di Pekanbaru, dibangun dengan Next.js, Tailwind CSS, shadcn/ui, dan Supabase. Semua konten bisa diubah lewat CMS dengan sinkronisasi real-time.',
    array['Next.js', 'Tailwind CSS', 'Supabase', 'shadcn/ui'],
    true,
    100
  )
on conflict (slug) do nothing;
