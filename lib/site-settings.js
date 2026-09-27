// Nilai default dipakai kalau tabel site_settings belum ada / belum di-migrate,
// supaya halaman tidak error dan tombol WA otomatis disembunyikan.
export const DEFAULT_SETTINGS = {
  hero_eyebrow: "Portofolio kerja — Heri",
  hero_headline: "Membangun web, automation, dan eksperimen",
  hero_headline_highlight: "yang benar-benar jalan.",
  hero_subtitle:
    "Kumpulan project full-stack web development, automation AI dengan n8n, dan berbagai eksperimen lain — sebagian besar dibangun dengan bantuan AI, dari ide sampai deploy.",
  cta_primary_label: "Lihat semua proyek",
  cta_secondary_label: "Tentang saya",
  footer_bio:
    "S.Kom, Teknik Informatika — fokus AI Engineering. Membangun website full-stack, automation AI, dan eksperimen lainnya.",
  whatsapp_number: "",
  whatsapp_message: "",
  whatsapp_enabled: false,
  cv_url: "",
};

export async function getSiteSettings(supabase) {
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
}