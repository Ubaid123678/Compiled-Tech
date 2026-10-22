// app/admin/blogs/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ReorderList } from "@/components/admin/ReorderList";

async function getBlogs() {
  const supabaseAdmin = getSupabaseAdmin();
  const run = (orderBy: "sort_order" | "created_at") =>
    supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order(orderBy, { ascending: orderBy === "sort_order" })
      .order("created_at", { ascending: false });

  let { data, error } = await run("sort_order");

  // Deploy-order safety: until SORT_ORDER_MIGRATION.sql is applied the column
  // is missing — fall back so the admin list still opens.
  if (error?.code === "42703") { ({ data, error } = await run("created_at")); }

  if (error) throw error;
  return data || [];
}

export default async function BlogsListPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const blogs = await getBlogs();

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
                Blog Posts
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-2xl">
            Blog Posts
          </h1>
          <Link
            href="/admin/blogs/new"
            className="bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] transition-all"
          >
            New Post
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-night/50 rounded-[20px] border border-line">
            <p className="text-mist/60 text-lg mb-4">No blog posts yet</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] transition-all"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <ReorderList
            table="blogs"
            items={blogs.map((blog) => ({
              id: blog.id,
              title: blog.title,
              subtitle: blog.excerpt,
              meta: blog.category,
              status: { label: blog.published ? "Published" : "Draft", published: blog.published },
            }))}
            editPath="/admin/blogs"
            deletePath="/api/admin/blogs"
            emptyLabel="No blog posts yet"
          />
        )}

      </main>
    </div>
  );
}