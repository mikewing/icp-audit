export const ENV = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  isProduction: process.env.NODE_ENV === "production",
};
