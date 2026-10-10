// app/admin/blogs/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { uploadAdminImage } from "@/lib/admin-upload";

const categories = ["AI", "Mobile", "Web", "Automation", "Guides"];

export default function NewBlogPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = () => {
    setForm((prev) => ({
      ...prev,
      slug: prev.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
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
    setLoading(true);

    const { error } = await supabase.from("blog_posts").insert({
      slug: form.slug,
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      date: new Date().toISOString().slice(0, 10),
      read_time: form.readTime,
      author: form.author,
      image: form.image,
      featured: form.featured,
      content: form.content,
      published: form.published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-line bg-ink/80 backdrop-blur-[14px] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin/blogs" className="text-mist/60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                ← Blog Posts
              </a>
              <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">
                New Blog Post
              </h1>
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
              onChange={(e) => { handleChange(e); generateSlug(); }}
              onBlur={generateSlug}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="Enter blog post title"
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
              onChange={handleChange}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="auto-generated-from-title"
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
                onChange={handleChange}
                required
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
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
                onChange={handleChange}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                placeholder="8 min"
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
              onChange={handleChange}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
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
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-none"
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
              onChange={handleChange}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="https://your-project.supabase.co/storage/v1/object/public/blog-images/cover.webp"
            />
            <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="mt-2 text-sm text-mist" />
            <p className="text-mist/60 text-sm mt-1">Upload to Supabase Storage → blog-images bucket, then paste public URL here</p>
          </div>

          <div>
            <label htmlFor="content" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={20}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-y font-mono text-sm"
              placeholder="# Heading\n\nContent here...\n\n## Subheading\n\n- List item\n- List item\n\n```code```\n\n> Blockquote"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-line bg-night text-steel focus:ring-steel"
              />
              <span className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-mist">Featured Post</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="w-5 h-5 rounded border-line bg-night text-steel focus:ring-steel"
              />
              <span className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-mist">Publish Immediately</span>
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
              className="flex-1 border border-line bg-night text-mist font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:border-steel/50 hover:text-frost transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] px-6 py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}