"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Tags,
  LayoutTemplate,
  GraduationCap,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildCategoryMap, UNKNOWN_CATEGORY } from "@/lib/categories";
import { EDUCATION_CONFIG, CERTIFICATES_CONFIG } from "@/lib/collections";
import ProjectForm from "@/components/admin/ProjectForm";
import CategoryManager from "@/components/admin/CategoryManager";
import SiteContentManager from "@/components/admin/SiteContentManager";
import CollectionManager from "@/components/admin/CollectionManager";

export default function DashboardClient({
  initialProjects,
  initialCategories,
  initialEducation,
  initialCertificates,
  initialSettings,
  userEmail,
}) {
  const supabase = createClient();
  const router = useRouter();

  const [projects, setProjects] = useState(initialProjects);
  const [categories, setCategories] = useState(initialCategories);
  const [education, setEducation] = useState(initialEducation);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [settings, setSettings] = useState(initialSettings);

  const [formOpen, setFormOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [contentManagerOpen, setContentManagerOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [certificatesOpen, setCertificatesOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  async function refreshProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    setProjects(data ?? []);
  }

  async function refreshCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: false });
    setCategories(data ?? []);
  }

  async function refreshEducation() {
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    setEducation(data ?? []);
  }

  async function refreshCertificates() {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    setCertificates(data ?? []);
  }

  function openNewForm() {
    setEditingProject(null);
    setFormOpen(true);
  }

  function openEditForm(project) {
    setEditingProject(project);
    setFormOpen(true);
  }

  async function handleDelete(id) {
    setDeletingId(id);
    await supabase.from("projects").delete().eq("id", id);
    setDeletingId(null);
    refreshProjects();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const overlayClass =
    "fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm";
  const secondaryBtn =
    "flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:border-cyan hover:text-cyan";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cyan">
            CMS
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
            Kelola Proyek
          </h1>
          {userEmail ? (
            <p className="mt-1 text-xs text-muted">Masuk sebagai {userEmail}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setContentManagerOpen(true)} className={secondaryBtn}>
            <LayoutTemplate size={16} /> Konten &amp; Foto
          </button>
          <button onClick={() => setEducationOpen(true)} className={secondaryBtn}>
            <GraduationCap size={16} /> Pendidikan
          </button>
          <button onClick={() => setCertificatesOpen(true)} className={secondaryBtn}>
            <Award size={16} /> Sertifikat
          </button>
          <button onClick={() => setCategoryManagerOpen(true)} className={secondaryBtn}>
            <Tags size={16} /> Kategori
          </button>
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-void"
          >
            <Plus size={16} /> Tambah Proyek
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-muted hover:text-ink"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {projects.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-10 text-center text-sm text-muted">
            Belum ada proyek. Klik &ldquo;Tambah Proyek&rdquo; untuk mulai.
          </p>
        ) : (
          projects.map((project) => {
            const category = categoryMap[project.category] ?? UNKNOWN_CATEGORY;
            return (
              <div
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4"
              >
                <div>
                  <p className="text-xs text-muted">{category.label}</p>
                  <p className="font-display font-semibold text-ink">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted">/proyek/{project.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(project)}
                    className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs text-ink hover:border-cyan hover:text-cyan"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs text-ink hover:border-magenta hover:text-magenta disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                    {deletingId === project.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {formOpen ? (
        <div className={overlayClass}>
          <div className="w-full max-w-2xl">
            <ProjectForm
              project={editingProject}
              categories={categories}
              onCancel={() => setFormOpen(false)}
              onSaved={() => {
                setFormOpen(false);
                refreshProjects();
              }}
            />
          </div>
        </div>
      ) : null}

      {categoryManagerOpen ? (
        <div className={overlayClass}>
          <CategoryManager
            categories={categories}
            onClose={() => setCategoryManagerOpen(false)}
            onChanged={refreshCategories}
          />
        </div>
      ) : null}

      {contentManagerOpen ? (
        <div className={overlayClass}>
          <SiteContentManager
            settings={settings}
            onClose={() => setContentManagerOpen(false)}
            onSaved={(updated) => {
              setSettings(updated);
              setContentManagerOpen(false);
            }}
          />
        </div>
      ) : null}

      {educationOpen ? (
        <div className={overlayClass}>
          <CollectionManager
            {...EDUCATION_CONFIG}
            items={education}
            onChanged={refreshEducation}
            onClose={() => setEducationOpen(false)}
          />
        </div>
      ) : null}

      {certificatesOpen ? (
        <div className={overlayClass}>
          <CollectionManager
            {...CERTIFICATES_CONFIG}
            items={certificates}
            onChanged={refreshCertificates}
            onClose={() => setCertificatesOpen(false)}
          />
        </div>
      ) : null}
    </main>
  );
}
