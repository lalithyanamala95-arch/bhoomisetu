import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ received: false, message: "Webhook is not configured." }, { status: 503 });
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected); const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return NextResponse.json({ received: false }, { status: 400 });
  try {
    const payload = JSON.parse(rawBody);
    const createdAt = Number(payload.created_at || 0);
    if (createdAt && Math.abs(Math.floor(Date.now() / 1000) - createdAt) > 300) {
      return NextResponse.json({ received: false, message: "Stale webhook." }, { status: 400 });
    }
    const entity = payload?.payload?.payment?.entity;
    if (payload.event === "payment.captured" && entity?.order_id) {
      const supabase = getSupabaseAdmin();
      await supabase.from("land_purchases").update({ status: "paid", razorpay_payment_id: entity.id, verified_at: new Date().toISOString() }).eq("razorpay_order_id", entity.order_id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
