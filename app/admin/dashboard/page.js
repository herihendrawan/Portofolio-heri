import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import DashboardClient from "@/components/admin/DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <DashboardClient
      initialProjects={projects ?? []}
      initialCategories={categories ?? []}
      initialSettings={settings}
      userEmail={user?.email}
    />
  );
}
