// app/admin/projects/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getProjects() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("work_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export default async function ProjectsListPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const projects = await getProjects();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-line bg-ink/80 backdrop-blur-[14px] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-mist/60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                \u2190 Dashboard
              </Link>
              <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">
                Projects
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-2xl">
            Projects
          </h1>
          <Link
            href="/admin/projects/new"
            className="bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] transition-all"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-night/50 rounded-[20px] border border-line">
            <p className="text-mist/60 text-lg mb-4">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] transition-all"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="py-4 px-4 font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">Title</th>
                  <th className="py-4 px-4 font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">Category</th>
                  <th className="py-4 px-4 font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">Year</th>
                  <th className="py-4 px-4 font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">Status</th>
                  <th className="py-4 px-4 font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-night/50">
                    <td className="py-4 px-4">
                      <div className="font-display font-semibold text-frost">{project.title}</div>
                      <div className="text-mist/60 text-sm line-clamp-1 max-w-xs">{project.excerpt}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel px-3 py-1 rounded-[999px] bg-slate/50 border border-line">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-mist/60">{project.year}</td>
                    <td className="py-4 px-4">
                      <span className={`${project.published ? "text-green-400" : "text-yellow-400"} font-display uppercase text-[0.72rem] tracking-[0.1em]`}>
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={"/admin/projects/" + project.id + "/edit"}
                          className="text-steel hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]"
                        >
                          Edit
                        </Link>
                        <form action={`/api/admin/projects/${project.id}`} method="post">
                          <button
                            type="submit"
                            className="text-red-400 hover:text-red-300 transition-colors text-sm font-display uppercase tracking-[0.1em]"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}