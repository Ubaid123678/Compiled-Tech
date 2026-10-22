// app/admin/projects/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { uploadAdminImage } from "@/lib/admin-upload";
import { workCategories } from "@/data/work";

const categories: string[] = [...workCategories];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditProjectPage() {
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
    category: "Web",
    excerpt: "",
    description: "",
    problem: "",
    solution: "",
    result: "",
    year: new Date().getFullYear(),
    role: "Full-cycle development",
    image: "",
    thumbnail: "",
    gallery_images: [] as string[],
    tech_stack: [] as string[],
    github_url: "",
    live_url: "",
    featured: false,
    published: false,
  });

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("work_projects")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/admin/projects");
        return;
      }

      setForm({
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        description: data.description,
        problem: data.problem,
        solution: data.solution,
        result: data.result,
        year: data.year,
        role: data.role,
        image: data.image,
        thumbnail: data.thumbnail,
        gallery_images: data.gallery_images,
        tech_stack: data.tech_stack,
        github_url: data.github_url,
        live_url: data.live_url,
        featured: data.featured,
        published: data.published,
      });
      setLoading(false);
    };

    fetchProject();
  }, [params.id, router, supabase]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, slug: slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error } = await supabase
      .from("work_projects")
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  const handleImageUpload = async (file: File, field: "image" | "thumbnail") => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminImage(file, "projects");
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (file: File, index: number) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadAdminImage(file, "projects");
      setForm((prev) => {
        const galleryImages = [...prev.gallery_images];
        galleryImages[index] = url;
        return { ...prev, gallery_images: galleryImages };
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project permanently?")) return;

    const { error } = await supabase.from("work_projects").delete().eq("id", form.id);
    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-line bg-ink/80 backdrop-blur-[14px] sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <a href="/admin/projects" className="text-mist/60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                  ← Projects
                </a>
                <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">Edit Project</h1>
              </div>
            </div>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-8 bg-slate/50 rounded w-1/2" />
          <div className="h-8 bg-slate/50 rounded w-1/2" />
          <div className="h-96 bg-slate/50 rounded" />
        </div>
      </main>
    </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-line bg-ink/80 backdrop-blur-[14px] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin/projects" className="text-mist/60 hover:text-frost transition-colors text-sm font-display uppercase tracking-[0.1em]">
                ← Projects
              </a>
              <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-xl">
                Edit Project
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
              onChange={handleTitleChange}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
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
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
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
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: parseInt(e.target.value) }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Your Role
            </label>
            <input
              id="role"
              name="role"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="Full-cycle development"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Short Description *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              required
              rows={3}
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-none"
              placeholder="One-line summary for listings"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                The Problem
              </label>
              <textarea
                name="problem"
                value={form.problem}
                onChange={(e) => setForm((p) => ({ ...p, problem: e.target.value }))}
                rows={4}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-none"
                placeholder="What problem did the client face?"
              />
            </div>

            <div>
              <label className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                What We Built
              </label>
              <textarea
                name="solution"
                value={form.solution}
                onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))}
                rows={4}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-none"
                placeholder="What solution did you build?"
              />
            </div>

            <div>
              <label className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Result
              </label>
              <textarea
                name="result"
                value={form.result}
                onChange={(e) => setForm((p) => ({ ...p, result: e.target.value }))}
                rows={4}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors resize-none"
                placeholder="Measurable outcomes (numbers, metrics, outcomes)"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2">
              {form.tech_stack.map((tech, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={tech}
                    onChange={(e) => {
                      const arr = [...form.tech_stack];
                      arr[i] = e.target.value;
                      setForm({ ...form, tech_stack: arr });
                    }}
                    className="flex-1 min-w-[150px] bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                    placeholder={i === 0 ? "React" : "Next.js"}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...form.tech_stack];
                      arr.splice(i, 1);
                      setForm((p) => ({ ...p, tech_stack: arr }));
                    }}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, tech_stack: [...p.tech_stack, ""] }))}
                className="text-steel hover:text-frost text-sm font-display uppercase tracking-[0.1em]"
              >
                + Add Technology
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Gallery Images
            </label>
            <div className="space-y-2">
              {form.gallery_images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={img}
                    onChange={(e) => {
                      const arr = [...form.gallery_images];
                      arr[i] = e.target.value;
                      setForm({ ...form, gallery_images: arr });
                    }}
                    className="flex-1 bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                    placeholder={`Image ${i + 1} URL (Supabase Storage)`}
                  />
                  <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleGalleryUpload(e.target.files[0], i)} className="self-center max-w-48 text-sm text-mist" />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...form.gallery_images];
                      arr.splice(i, 1);
                      setForm((p) => ({ ...p, gallery_images: arr }));
                    }}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, gallery_images: [...p.gallery_images, ""] }))}
                className="text-steel hover:text-frost text-sm font-display uppercase tracking-[0.1em]"
              >
                + Add Image
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="image" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Hero Image URL
              </label>
              <input
                id="image"
                name="image"
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                placeholder="Supabase Storage URL"
              />
              <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "image")} className="mt-2 text-sm text-mist" />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Thumbnail URL
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                value={form.thumbnail}
                onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                placeholder="Supabase Storage URL"
              />
              <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "thumbnail")} className="mt-2 text-sm text-mist" />
            </div>

            <div>
              <label htmlFor="year" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: parseInt(e.target.value) }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="github_url" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                GitHub URL
              </label>
              <input
                id="github_url"
                name="github_url"
                value={form.github_url}
                onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label htmlFor="live_url" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                Live Preview URL
              </label>
              <input
                id="live_url"
                name="live_url"
                value={form.live_url}
                onChange={(e) => setForm((p) => ({ ...p, live_url: e.target.value }))}
                className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
                placeholder="https://project.demo.com"
              />
            </div>
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
              <span className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-mist">Publish Project</span>
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
              Delete Project
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}