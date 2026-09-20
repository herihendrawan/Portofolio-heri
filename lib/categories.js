// Kategori sekarang disimpan di tabel `categories` (Supabase), bukan
// hardcode di sini lagi — supaya bisa ditambah/hapus dari CMS.
// File ini hanya menyimpan util kecil yang dipakai bareng oleh
// komponen publik & admin.

export const ACCENTS = ["cyan", "magenta", "violet"];

export const ACCENT_TEXT_CLASS = {
  cyan: "text-cyan",
  magenta: "text-magenta",
  violet: "text-violet",
};

export const ACCENT_BG_CLASS = {
  cyan: "bg-cyan/10",
  magenta: "bg-magenta/10",
  violet: "bg-violet/10",
};

// Fallback dipakai kalau kategori project tidak (lagi) ada di tabel categories
// (mis. baru saja dihapus admin lain).
export const UNKNOWN_CATEGORY = {
  value: "lainnya",
  label: "Lainnya",
  accent: "violet",
};

export function getCategoryFromList(categories, value) {
  return categories.find((c) => c.value === value) ?? UNKNOWN_CATEGORY;
}

export function buildCategoryMap(categories) {
  return Object.fromEntries(categories.map((c) => [c.value, c]));
}
