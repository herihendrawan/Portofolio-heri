import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: categories }, settings] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: false }),
    getSiteSettings(supabase),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          eyebrow={settings.hero_eyebrow}
          headline={settings.hero_headline}
          headlineHighlight={settings.hero_headline_highlight}
          subtitle={settings.hero_subtitle}
          ctaPrimaryLabel={settings.cta_primary_label}
          ctaSecondaryLabel={settings.cta_secondary_label}
        />
        <ProjectsExplorer
          projects={projects ?? []}
          categories={categories ?? []}
        />
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
