import { createSupabaseAdminClient } from "@/lib/supabase/server";

/** Best-effort tracking; a database outage must never prevent demo access. */
export async function recordDemoLogin(googleSub: string, email: string): Promise<void> {
  try {
    const { error } = await createSupabaseAdminClient()
      .rpc("record_demo_login", { p_google_sub: googleSub, p_email: email })
      .abortSignal(AbortSignal.timeout(3000));
    if (error) console.warn("Demo login tracking failed.");
  } catch {
    console.warn("Demo login tracking unavailable.");
  }
}
