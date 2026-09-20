"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { buildCategoryMap } from "@/lib/categories";

export default function ProjectsExplorer({ projects, categories }) {
  const [active, setActive] = useState("semua");
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  const filtered = useMemo(() => {
    if (active === "semua") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  const tabs = [{ value: "semua", label: "Semua" }, ...categories];

  return (
    <section id="proyek" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-magenta">
            Proyek
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Semua yang pernah dibangun
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active === tab.value
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-10 text-center text-sm text-muted">
          Belum ada proyek di kategori ini.
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                category={categoryMap[project.category]}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
