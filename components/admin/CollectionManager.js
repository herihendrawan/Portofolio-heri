"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

const inputClass =
  "w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan";

function emptyValues(fields) {
  const values = {};
  fields.forEach((f) => {
    values[f.name] = f.type === "number" ? 0 : "";
  });
  return values;
}

export default function CollectionManager({
  heading,
  table,
  items,
  fields,
  primaryKey,
  secondaryKey,
  onChanged,
  onClose,
}) {
  const supabase = createClient();

  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState(() => emptyValues(fields));
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function openNew() {
    const nextOrder =
      items.reduce((max, i) => Math.max(max, i.sort_order ?? 0), 0) + 10;
    setValues({ ...emptyValues(fields), sort_order: nextOrder });
    setFiles({});
    setEditingId(null);
    setError("");
    setMode("form");
  }

  function openEdit(item) {
    const next = emptyValues(fields);
    fields.forEach((f) => {
      next[f.name] = item[f.name] ?? next[f.name];
    });
    setValues(next);
    setFiles({});
    setEditingId(item.id);
    setError("");
    setMode("form");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {};

      for (const f of fields) {
        let value = values[f.name];

        if (f.type === "image") {
          const file = files[f.name];
          if (file) {
            const fileName = `${table}-${Date.now()}-${slugify(file.name)}`;
            const { error: uploadError } = await supabase.storage
              .from("project-images")
              .upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from("project-images")
              .getPublicUrl(fileName);
            value = urlData.publicUrl;
          }
        }

        if (f.type === "number") {
          value = Number(value) || 0;
        } else if (typeof value === "string") {
          value = value.trim();
          if (!value && !f.required) value = null;
        }

        payload[f.name] = value;
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from(table)
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from(table)
          .insert(payload);
        if (insertError) throw insertError;
      }

      await onChanged();
      setMode("list");
    } catch (err) {
      setError(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Hapus "${item[primaryKey]}"?`)) return;
    setDeletingId(item.id);
    setError("");

    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", item.id);

    setDeletingId(null);

    if (deleteError) {
      setError(`Gagal menghapus: ${deleteError.message}`);
      return;
    }
    await onChanged();
  }

  return (
    <div className="glow-border max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cyan">CMS</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            {mode === "list"
              ? heading
              : editingId
                ? "Edit data"
                : "Tambah data"}
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

      {mode === "list" ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-void"
          >
            <Plus size={16} /> Tambah
          </button>

          <div className="mt-5 space-y-2">
            {items.length === 0 ? (
              <p className="rounded-xl border border-line p-6 text-center text-sm text-muted">
                Belum ada data. Klik &ldquo;Tambah&rdquo; untuk mulai.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink">
                      {item[primaryKey]}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {item[secondaryKey]}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:border-cyan hover:text-cyan"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:border-magenta hover:text-magenta disabled:opacity-60"
                    >
                      <Trash2 size={13} />
                      {deletingId === item.id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {error ? <p className="mt-4 text-sm text-magenta">{error}</p> : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs text-muted">{f.label}</label>

              {f.type === "textarea" ? (
                <textarea
                  rows={4}
                  required={f.required}
                  value={values[f.name]}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  className={inputClass}
                />
              ) : f.type === "image" ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFiles((prev) => ({
                        ...prev,
                        [f.name]: e.target.files?.[0] ?? null,
                      }))
                    }
                    className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cyan file:px-4 file:py-1.5 file:text-void"
                  />
                  {values[f.name] ? (
                    <p className="mt-1 text-xs text-muted">
                      Sudah ada gambar. Pilih file baru hanya kalau mau menggantinya.
                    </p>
                  ) : null}
                </div>
              ) : (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => setValue(f.name, e.target.value)}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          {error ? <p className="text-sm text-magenta">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setMode("list");
              }}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-muted hover:text-ink"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-void disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
