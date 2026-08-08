import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ success: false, message: "Land id is required." }, { status: 400 });
    }

    const updates = {
      verified: Boolean(body.verified),
      verification_level: body.verified ? (body.verificationLevel || "BhoomiSetu Verified") : "Pending Verification",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("lands")
      .update(updates)
      .eq("id", id)
      .select("id,title,verified,verification_level")
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to update property." },
      { status: 500 }
    );
  }
}
