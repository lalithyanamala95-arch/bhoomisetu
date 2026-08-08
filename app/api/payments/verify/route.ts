import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAuthenticatedUser, getUserSupabaseClient } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  try {
    const supabase = await getUserSupabaseClient(request);
    if (!supabase) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    const body = await request.json();
    const landId = String(body.landId || "");
    const orderId = String(body.razorpay_order_id || "");
    const paymentId = String(body.razorpay_payment_id || "");
    const signature = String(body.razorpay_signature || "");

    if (!landId || !orderId || !paymentId || !signature) {
      return NextResponse.json({ success: false, message: "Incomplete payment verification data." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ success: false, message: "Payment verification is not configured." }, { status: 503 });

    const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
    }

    const { data: purchase, error: purchaseError } = await supabase
      .from("land_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("land_id", landId)
      .eq("razorpay_order_id", orderId)
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json({ success: false, message: "Payment order was not found." }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("land_purchases")
      .update({ status: "paid", razorpay_payment_id: paymentId, verified_at: new Date().toISOString() })
      .eq("id", purchase.id)
      .eq("user_id", user.id);

    if (updateError) return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });

    return NextResponse.json({ success: true, unlocked: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 500 }
    );
  }
}
