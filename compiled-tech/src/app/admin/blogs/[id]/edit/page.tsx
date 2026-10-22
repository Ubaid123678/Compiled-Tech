// app/admin/blogs/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { uploadAdminImage } from "@/lib/admin-upload";

const categories = ["AI", "Mobile", "Web", "Automation", "Guides"];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    category: "AI",
    excerpt: "",
    content: "",
    readTime: "5 min",
    author: "Compiled Tech Team",
    featured: false,
    published: false,
    image: "",
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(new RegExp("[^a-z0-9]+", "g"), "-")
      .replace(new RegExp("^-|-$", "g"), "");
  };

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/admin/blogs");
        return;
      }

      setForm({
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
        readTime: data.read_time,
        author: data.author,
        featured: data.featured,
        published: data.published,
        image: data.image,
      });
      setLoading(false);
    };

    fetchBlog();
  }, [params.id, router, supabase]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminImage(file, "blogs");
      setForm((prev) => ({ ...prev, image: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug: form.slug,
        title: form.title,
        category: form.category,
        excerpt: form.excerpt,
        read_time: form.readTime,
        author: form.author,
        image: form.image,
        featured: form.featured,
        content: form.content,
        published: form.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this blog post permanently?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", form.id);
    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-line bg-ink opacity-80 backdrop-blur-[14px] sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <a href="/admin/blogs" className="text-mist opacity-60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                  Back to Blog Posts
                </a>
                <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">Edit Blog Post</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="text-center py-16">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-line bg-ink opacity-80 backdrop-blur-[14px] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin/blogs" className="text-mist opacity-60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                Back to Blog Posts
              </a>
              <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">Edit Blog Post</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="readTime" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Read Time
              </label>
              <input
                id="readTime"
                name="readTime"
                value={form.readTime}
                onChange={(e) => setForm((p) => ({ ...p, readTime: e.target.value }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="author" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Author
            </label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
              placeholder="Author name"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              required
              rows={3}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors resize-none"
              placeholder="Short description for listings and SEO"
            />
          </div>

          <div>
            <label htmlFor="image" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Hero Image URL
            </label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors"
              placeholder="https://your-project.supabase.co/storage/v1/object/public/blog-images/cover.webp"
            />
            <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="mt-2 text-sm text-mist" />
            <p className="text-mist opacity-60 text-sm mt-1">Upload to Supabase Storage → blog-images bucket, then paste public URL here</p>
          </div>

          <div>
            <label htmlFor="content" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              required
              rows={20}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel opacity-50 transition-colors resize-y font-mono text-sm"
              placeholder="# Heading\n\nContent here...\n\n## Subheading\n\n- List item\n- List item\n\n```code```\n\n> Blockquote"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                className="w-5 h-5 rounded border-line bg-night text-steel focus:ring-steel"
              />
              <span className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-mist">Publish</span>
            </label>
          </div>

          {error && (
            <div className="p-4 rounded-[12px] bg-red-900/30 border border-red-500/30 text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-line">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-line bg-night text-mist font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:border-steel opacity-50 hover:text-frost transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="pt-4 border-t border-line">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-900/30 text-red-400 font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-red-900/50 hover:text-red-300 transition-colors"
            >
              Delete Post
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}