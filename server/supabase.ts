import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] SUPABASE_URL or SUPABASE_ANON_KEY is not set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Write 1: True upsert on coaches table — returns the UUID
// ---------------------------------------------------------------------------
export async function upsertCoach(params: {
  email: string;
  name: string;
}): Promise<string> {
  const { email, name } = params;

  const { data, error } = await supabase
    .from("coaches")
    .upsert(
      {
        email,
        name,
        source: "icp_audit",
        joined_at: new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(
      `[Supabase] coaches upsert failed: ${error?.message ?? "no id returned"}`
    );
  }

  return data.id as string;
}

// ---------------------------------------------------------------------------
// Write 2: Insert the ICP audit result row
// psychographicProfile is stored as a JSON string wrapping the full AI text.
// rawResponses includes all submitted form fields (answers + name + email).
// ---------------------------------------------------------------------------
export async function insertAuditResult(params: {
  coachId: string;
  psychographicProfile: string;
  rawResponses: Record<string, string>;
}): Promise<void> {
  const { coachId, psychographicProfile, rawResponses } = params;

  // Wrap the AI text in a JSON envelope so the column is always valid JSON
  const profileJson = JSON.stringify({ output: psychographicProfile });

  const { error } = await supabase.from("icp_audit_results").insert({
    coach_id: coachId,
    psychographic_profile: profileJson,
    raw_responses: rawResponses,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`[Supabase] icp_audit_results insert failed: ${error.message}`);
  }
}
