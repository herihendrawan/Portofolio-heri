"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

function makeEmptyForm(categories) {
  return {
    title: "",
    slug: "",
    category: categories[0]?.value ?? "",
    summary: "",
    description: "",
    tech_stack: "",
    project_url: "",
    repo_url: "",
    is_featured: false,
    sort_order: 0,
    cover_image_url: "",
  };
}

export default function ProjectForm({ project, categories, onSaved, onCancel }) {
  const supabase = createClient();
  const isEdit = Boolean(project);

  const [form, setForm] = useState(
    project
      ? { ...project, tech_stack: (project.tech_stack ?? []).join(", ") }
      : makeEmptyForm(categories)
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleTitleChange(value) {
    update("title", value);
    if (!slugTouched) {
      update("slug", slugify(value));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let coverImageUrl = form.cover_image_url || null;

      if (file) {
        const fileName = `${Date.now()}-${slugify(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        coverImageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        category: form.category,
        summary: form.summary,
        description: form.description,
        tech_stack: form.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        project_url: form.project_url || null,
        repo_url: form.repo_url || null,
        is_featured: form.is_featured,
        sort_order: Number(form.sort_order) || 0,
        cover_image_url: coverImageUrl,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", project.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert(payload);
        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err) {
      setError(err.message || "Gagal menyimpan proyek.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glow-border max-h-[85vh] overflow-y-auto rounded-2xl bg-surface p-6"
    >
      <h2 className="font-display text-xl font-semibold text-ink">
        {isEdit ? "Edit Proyek" : "Tambah Proyek"}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">Judul</label>
          <input
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">
            Slug (URL) — /proyek/...
          </label>
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Kategori</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Urutan tampil (angka besar = di atas)
          </label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => update("sort_order", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">
            Ringkasan singkat (tampil di kartu)
          </label>
          <textarea
            required
            rows={2}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">
            Deskripsi lengkap (tampil di halaman detail)
          </label>
          <textarea
            required
            rows={6}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">
            Tech stack (pisahkan dengan koma)
          </label>
          <input
            value={form.tech_stack}
            onChange={(e) => update("tech_stack", e.target.value)}
            placeholder="Next.js, Supabase, n8n"
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Link live demo (opsional)
          </label>
          <input
            value={form.project_url}
            onChange={(e) => update("project_url", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">
            Link repository (opsional)
          </label>
          <input
            value={form.repo_url}
            onChange={(e) => update("repo_url", e.target.value)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none focus:border-cyan"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">
            Gambar cover {form.cover_image_url ? "(ganti gambar)" : ""}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-line bg-void px-4 py-2.5 text-sm text-ink outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cyan file:px-4 file:py-1.5 file:text-void"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => update("is_featured", e.target.checked)}
            className="h-4 w-4 accent-cyan"
          />
          Tandai sebagai proyek unggulan
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-magenta">{error}</p> : null}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-5 py-2.5 text-sm text-muted hover:text-ink"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-cyan px-6 py-2.5 text-sm font-semibold text-void disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Proyek"}
        </button>
      </div>
    </form>
  );
}
