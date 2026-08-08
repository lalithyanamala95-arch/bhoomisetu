import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getUserSupabaseClient } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ success: true, unlocked: false });

  const supabase = await getUserSupabaseClient(request);
  const landId = request.nextUrl.searchParams.get("landId");
  if (!landId) return NextResponse.json({ success: true, unlocked: false });

  const { data } = await supabase
    .from("land_purchases")
    .select("id,status")
    .eq("user_id", user.id)
    .eq("land_id", landId)
    .eq("status", "paid")
    .maybeSingle();

  return NextResponse.json({ success: true, unlocked: Boolean(data) });
}
