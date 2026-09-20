"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SiteContentManager({ settings, onSaved, onClose }) {
  const supabase = createClient();

  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: updateError } = await supabase
      .from("site_settings")
      .update({
        hero_eyebrow: form.hero_eyebrow,
        hero_headline: form.hero_headline,
        hero_headline_highlight: form.hero_headline_highlight,
        hero_subtitle: form.hero_subtitle,
        cta_primary_label: form.cta_primary_label,
        cta_secondary_label: form.cta_secondary_label,
        whatsapp_number: form.whatsapp_number,
        whatsapp_message: form.whatsapp_message,
        whatsapp_enabled: form.whatsapp_enabled,
      })
      .eq("id", 1);

    setSaving(false);

    if (updateError) {
      setError(
        "Gagal menyimpan. Pastikan tabel site_settings sudah dibuat (jalankan supabase/migration_site_settings.sql)."
      );
      return;
    }

    onSaved(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glow-border max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cyan">CMS</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            Kelola Konten Hero &amp; WhatsApp
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-1.5 text-muted hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <p className="font-display text-xs tracking-[0.15em] text-magenta">
          BAGIAN HERO
        </p>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Label kecil di atas judul
          </label>
          <input
            value={form.hero_eyebrow}
            onChange={(e) => update("hero_eyebrow", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Judul utama (bagian normal)
          </label>
          <input
            value={form.hero_headline}
            onChange={(e) => update("hero_headline", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Judul utama (bagian yang menyala cyan)
          </label>
          <input
            value={form.hero_headline_highlight}
            onChange={(e) => update("hero_headline_highlight", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Deskripsi singkat di bawah judul
          </label>
          <textarea
            rows={3}
            value={form.hero_subtitle}
            onChange={(e) => update("hero_subtitle", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">
              Teks tombol utama
            </label>
            <input
              value={form.cta_primary_label}
              onChange={(e) => update("cta_primary_label", e.target.value)}
              className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">
              Teks tombol kedua
            </label>
            <input
              value={form.cta_secondary_label}
              onChange={(e) => update("cta_secondary_label", e.target.value)}
              className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
            />
          </div>
        </div>

        <p className="pt-2 font-display text-xs tracking-[0.15em] text-magenta">
          TOMBOL WHATSAPP
        </p>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.whatsapp_enabled}
            onChange={(e) => update("whatsapp_enabled", e.target.checked)}
            className="h-4 w-4 accent-cyan"
          />
          Tampilkan tombol chat WhatsApp di website
        </label>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Nomor WhatsApp (pakai kode negara, tanpa + atau spasi — contoh: 6281234567890)
          </label>
          <input
            value={form.whatsapp_number}
            onChange={(e) => update("whatsapp_number", e.target.value)}
            placeholder="6281234567890"
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Pesan otomatis saat tombol diklik
          </label>
          <textarea
            rows={2}
            value={form.whatsapp_message}
            onChange={(e) => update("whatsapp_message", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-magenta">{error}</p> : null}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-5 py-2.5 text-sm text-muted hover:text-ink"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-void disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
