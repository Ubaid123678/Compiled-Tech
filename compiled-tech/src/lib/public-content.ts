import { createClient } from "@supabase/supabase-js";

export function getPublicContentClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Public content database is not configured");

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(5000) }),
    },
  });
}

export function contentFailure(source: string, error: { code?: string; message?: string }): never {
  console.error(`Could not load ${source}`, { code: error.code, message: error.message });
  throw new Error(`Could not load ${source}`);
}
