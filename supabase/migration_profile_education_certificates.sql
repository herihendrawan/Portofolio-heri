-- ============================================================
-- MIGRASI: Foto profil, Pendidikan, Sertifikat
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- Aman dijalankan berulang (idempotent).
-- ============================================================

-- 1. Kolom foto profil di site_settings
alter table public.site_settings
  add column if not exists profile_photo_url text;

-- 2. Tabel pendidikan
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  period text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Tabel sertifikat
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_date text,
  credential_url text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. RLS: publik boleh baca, hanya admin yang login boleh tulis
do $$
declare t text;
begin
  foreach t in array array['education', 'certificates'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', 'Public can read ' || t, t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      'Public can read ' || t, t);

    execute format('drop policy if exists %I on public.%I', 'Authenticated can insert ' || t, t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (true)',
      'Authenticated can insert ' || t, t);

    execute format('drop policy if exists %I on public.%I', 'Authenticated can update ' || t, t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (true) with check (true)',
      'Authenticated can update ' || t, t);

    execute format('drop policy if exists %I on public.%I', 'Authenticated can delete ' || t, t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (true)',
      'Authenticated can delete ' || t, t);
  end loop;
end $$;

-- 5. Muat ulang skema supaya kolom/tabel baru langsung dikenali
notify pgrst, 'reload schema';
