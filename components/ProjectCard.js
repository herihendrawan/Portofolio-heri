"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ACCENT_TEXT_CLASS as accentText,
  ACCENT_BG_CLASS as accentBg,
  UNKNOWN_CATEGORY,
} from "@/lib/categories";

export default function ProjectCard({ project, category }) {
  const resolvedCategory = category ?? UNKNOWN_CATEGORY;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={`/proyek/${project.slug}`}
        className="glow-border group flex h-full flex-col overflow-hidden rounded-2xl bg-surface"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xs tracking-widest text-muted">
              NO PREVIEW
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${accentBg[resolvedCategory.accent]} ${accentText[resolvedCategory.accent]}`}
          >
            {resolvedCategory.label}
          </span>

          <h3 className="font-display text-lg font-semibold text-ink">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted">{project.summary}</p>

          {project.tech_stack?.length ? (
            <div className="mt-auto flex flex-wrap gap-2 pt-2 text-xs text-muted">
              {project.tech_stack.slice(0, 4).map((t) => (
                <span key={t} className="rounded border border-line px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
