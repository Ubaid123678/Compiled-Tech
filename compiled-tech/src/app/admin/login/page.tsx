// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md bg-night border border-line rounded-[20px] p-8">
        <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-mist text-base leading-[1.65] mb-8 text-center">
          Sign in to manage content
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-[12px] bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="admin@compiled.tech"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-night border border-line rounded-[12px] px-4 py-3 text-frost placeholder:text-mist/40 focus:outline-none focus:border-steel focus:ring-2 focus:ring-steel/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-steel text-ink font-display uppercase text-[0.72rem] tracking-[0.14em] py-3 rounded-full hover:bg-frost hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(185_198_212/_0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}