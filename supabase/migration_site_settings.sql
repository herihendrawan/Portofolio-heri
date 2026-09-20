-- ============================================================
-- MIGRASI: Konten Hero & Tombol WhatsApp
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- ============================================================

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

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

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

-- Baris tunggal (id selalu 1) — form CMS akan update baris ini, bukan insert baru.
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;
