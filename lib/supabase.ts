import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseAdminEnv, hasSupabasePublicEnv } from "@/lib/env";

export function getSupabasePublicClient() {
  if (!hasSupabasePublicEnv) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
