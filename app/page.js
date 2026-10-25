import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EducationSection from "@/components/EducationSection";
import CertificatesSection from "@/components/CertificatesSection";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: projects },
    { data: categories },
    { data: education },
    { data: certificates },
    settings,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: false }),
    supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false }),
    getSiteSettings(supabase),
  ]);

  return (
    <>
      <Navbar cvUrl={settings.cv_url} />
      <main>
        <Hero
          eyebrow={settings.hero_eyebrow}
          headline={settings.hero_headline}
          headlineHighlight={settings.hero_headline_highlight}
          subtitle={settings.hero_subtitle}
          ctaPrimaryLabel={settings.cta_primary_label}
          ctaSecondaryLabel={settings.cta_secondary_label}
          photoUrl={settings.profile_photo_url}
        />
        <EducationSection items={education ?? []} />
        <CertificatesSection items={certificates ?? []} />
        <ProjectsExplorer
          projects={projects ?? []}
          categories={categories ?? []}
        />
      </main>
      <Footer bio={settings.footer_bio} />
      {settings.whatsapp_enabled ? (
        <WhatsAppButton
          number={settings.whatsapp_number}
          message={settings.whatsapp_message}
        />
      ) : null}
    </>
  );
}
