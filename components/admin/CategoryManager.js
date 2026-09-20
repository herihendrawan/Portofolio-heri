"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { ACCENTS, ACCENT_TEXT_CLASS, ACCENT_BG_CLASS } from "@/lib/categories";

export default function CategoryManager({ categories, onChanged, onClose }) {
  const supabase = createClient();

  const [label, setLabel] = useState("");
  const [accent, setAccent] = useState("cyan");
  const [saving, setSaving] = useState(false);
  const [deletingValue, setDeletingValue] = useState(null);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    setError("");

    const value = slugify(label);
    const nextSortOrder =
      (categories.reduce((max, c) => Math.max(max, c.sort_order), 0) || 0) + 10;

    const { error: insertError } = await supabase.from("categories").insert({
      value,
      label: label.trim(),
      accent,
      sort_order: nextSortOrder,
    });

    setSaving(false);

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Kategori dengan nama itu sudah ada."
          : "Gagal menambah kategori."
      );
      return;
    }

    setLabel("");
    onChanged();
  }

  async function handleDelete(value) {
    setDeletingValue(value);
    setError("");

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("value", value);

    setDeletingValue(null);

    if (deleteError) {
      setError(
        "Kategori ini masih dipakai oleh salah satu proyek — pindahkan dulu proyeknya ke kategori lain sebelum menghapus."
      );
      return;
    }

    onChanged();
  }

  return (
    <div className="glow-border w-full max-w-md rounded-2xl bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cyan">
            CMS
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            Kelola Kategori
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-1.5 text-muted hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-muted">Belum ada kategori.</p>
        ) : (
          categories.map((c) => (
            <div
              key={c.value}
              className="flex items-center justify-between rounded-lg border border-line px-3 py-2"
            >
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${ACCENT_BG_CLASS[c.accent]} ${ACCENT_TEXT_CLASS[c.accent]}`}
              >
                {c.label}
              </span>
              <button
                onClick={() => handleDelete(c.value)}
                disabled={deletingValue === c.value}
                className="rounded-full p-1.5 text-muted hover:text-magenta disabled:opacity-60"
                aria-label={`Hapus kategori ${c.label}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-6 border-t border-line pt-5">
        <label className="mb-1 block text-xs text-muted">
          Nama kategori baru
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Data Science"
          className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
        />

        <label className="mb-1 mt-4 block text-xs text-muted">Warna</label>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => setAccent(a)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${ACCENT_BG_CLASS[a]} ${ACCENT_TEXT_CLASS[a]} ${
                accent === a ? "border-current" : "border-transparent"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {error ? <p className="mt-3 text-sm text-magenta">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cyan py-2.5 text-sm font-semibold text-void disabled:opacity-60"
        >
          <Plus size={16} />
          {saving ? "Menambah..." : "Tambah Kategori"}
        </button>
      </form>
    </div>
  );
}
