-- ============================================================
-- MIGRASI: Upload CV
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Kolom untuk menyimpan link CV di site_settings
alter table public.site_settings
  add column if not exists cv_url text;

-- 2. Storage bucket khusus dokumen (CV, dsb) — beda dari project-images
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

drop policy if exists "Public can view documents" on storage.objects;
create policy "Public can view documents"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'documents');

drop policy if exists "Authenticated can upload documents" on storage.objects;
create policy "Authenticated can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

drop policy if exists "Authenticated can update documents" on storage.objects;
create policy "Authenticated can update documents"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'documents');

drop policy if exists "Authenticated can delete documents" on storage.objects;
create policy "Authenticated can delete documents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documents');