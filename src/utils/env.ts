import { load } from "@std/dotenv";

// Load environment variables from .env file
await load({ export: true });

export function getEnvVar(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config = {
  supabase: {
    url: getEnvVar('SUPABASE_URL'),
    anonKey: getEnvVar('SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
}; 