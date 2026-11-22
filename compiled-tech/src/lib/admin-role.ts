import type { User } from "@supabase/supabase-js";

export function isSiteAdmin(user: User | null): user is User {
  return !!user && !user.is_anonymous && user.app_metadata.compiled_tech_admin === true;
}
