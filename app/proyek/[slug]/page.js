import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCategoryFromList, UNKNOWN_CATEGORY } from "@/lib/categories";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 0;

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: categories }, settings] = await Promise.all([
    supabase.from("projects").select("*").eq("slug", slug).single(),
    supabase.from("categories").select("*"),
    getSiteSettings(supabase),
  ]);

  if (!project) notFound();

  const category = categories
    ? getCategoryFromList(categories, project.category)
    : UNKNOWN_CATEGORY;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/#proyek" className="text-sm text-muted hover:text-cyan">
          &larr; Kembali ke semua proyek
        </Link>

        <p className="mt-6 font-display text-xs tracking-[0.2em] text-magenta">
          {category.label}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-base text-muted">{project.summary}</p>

        {project.cover_image_url ? (
          <div className="glow-border relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-sm leading-relaxed text-ink/90">
          {project.description}
        </div>

        {project.tech_stack?.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4">
          {project.project_url ? (
            <a
              href={project.project_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-void"
            >
              Kunjungi live demo
            </a>
          ) : null}
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="glow-border rounded-full px-6 py-3 text-sm font-semibold text-ink"
            >
              Lihat source code
            </a>
          ) : null}
        </div>
      </main>
      <Footer />
      {settings.whatsapp_enabled ? (
        <WhatsAppButton
          number={settings.whatsapp_number}
          message={settings.whatsapp_message}
        />
      ) : null}
    </>
  );
}
