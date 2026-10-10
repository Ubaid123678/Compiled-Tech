// app/admin/page.tsx
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getStats() {
  const supabaseAdmin = getSupabaseAdmin();
  const [{ count: blogs }, { count: projects }] = await Promise.all([
    supabaseAdmin.from("blog_posts").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("work_projects").select("*", { count: "exact", head: true }),
  ]);
  return { blogs: blogs || 0, projects: projects || 0 };
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const stats = await getStats();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-line bg-ink/80 backdrop-blur-[14px] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-mist text-sm">{user?.email}</span>
              <form action="/api/auth/signout" method="POST">
                <button className="text-mist/60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/blogs"
            className="group rounded-[20px] border border-line bg-night p-6 transition-all hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl mb-2">
                  Blog Posts
                </h2>
                <p className="text-mist/60">Manage blog content</p>
              </div>
              <span className="text-steel text-4xl group-hover:text-frost transition-colors">→</span>
            </div>
            <div className="mt-6 pt-6 border-t border-line flex items-center justify-between">
              <span className="font-display font-semibold text-frost text-2xl">{stats.blogs}</span>
              <span className="text-mist/60 text-sm">Total posts</span>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="group rounded-[20px] border border-line bg-night p-6 transition-all hover:border-steel/40 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl mb-2">
                  Projects
                </h2>
                <p className="text-mist/60">Manage project portfolio</p>
              </div>
              <span className="text-steel text-4xl group-hover:text-frost transition-colors">→</span>
            </div>
            <div className="mt-6 pt-6 border-t border-line flex items-center justify-between">
              <span className="font-display font-semibold text-frost text-2xl">{stats.projects}</span>
              <span className="text-mist/60 text-sm">Total projects</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}