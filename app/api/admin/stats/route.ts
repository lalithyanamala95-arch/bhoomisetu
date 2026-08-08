import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const supabase = getSupabaseAdmin();
    const [{ count: total }, { count: verified }, { count: pending }, { count: purchases }, revenueRows, recent] =
      await Promise.all([
        supabase.from("lands").select("id", { count: "exact", head: true }),
        supabase.from("lands").select("id", { count: "exact", head: true }).eq("verified", true),
        supabase.from("lands").select("id", { count: "exact", head: true }).eq("verified", false),
        supabase.from("land_purchases").select("id", { count: "exact", head: true }).eq("status", "paid"),
        supabase.from("land_purchases").select("amount_inr").eq("status", "paid"),
        supabase
          .from("lands")
          .select("id,title,location,area,land_type,verified,verification_level,created_at,image_urls")
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: total ?? 0,
        verified: verified ?? 0,
        pending: pending ?? 0,
        purchases: purchases ?? 0,
        revenueInr: (revenueRows.data ?? []).reduce((sum, row) => sum + Number(row.amount_inr || 0), 0),
      },
      recent: recent.data ?? [],
      warnings: recent.error ? [recent.error.message] : [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load admin data." },
      { status: 500 }
    );
  }
}
