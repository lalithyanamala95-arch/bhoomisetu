import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = {
  from(...args: Parameters<ReturnType<typeof getSupabaseClient>["from"]>) {
    return getSupabaseClient().from(...args);
  },
  auth: {
    getUser(...args: Parameters<ReturnType<typeof getSupabaseClient>["auth"]["getUser"]>) {
      return getSupabaseClient().auth.getUser(...args);
    },
  },
} as ReturnType<typeof getSupabaseClient>;