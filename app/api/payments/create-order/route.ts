import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getUserSupabaseClient } from "@/lib/admin";

const DEFAULT_PRICE_INR = 99;

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ success: false, message: "Please sign in to unlock this report." }, { status: 401 });
  }

  try {
    const supabase = await getUserSupabaseClient(request);
    if (!supabase) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    const { landId } = await request.json();
    const id = String(landId || "").trim();
    if (!id) return NextResponse.json({ success: false, message: "Land id is required." }, { status: 400 });

    const { data: existing } = await supabase
      .from("land_purchases")
      .select("id,status")
      .eq("land_id", id)
      .eq("user_id", user.id)
      .eq("status", "paid")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, alreadyUnlocked: true });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const price = Number(process.env.PREMIUM_PRICE_INR || DEFAULT_PRICE_INR);

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, message: "Payments are not configured yet. Add Razorpay test keys in the deployment environment." },
        { status: 503 }
      );
    }

    if (!Number.isFinite(price) || price < 1 || price > 500000) {
      return NextResponse.json({ success: false, message: "Invalid premium price configuration." }, { status: 500 });
    }

    const amount = Math.round(price * 100);

    const land = await supabase.from("lands").select("id,title").eq("id", id).single();
    if (land.error || !land.data) {
      return NextResponse.json({ success: false, message: "Land not found." }, { status: 404 });
    }

    const receipt = `bs_${Date.now()}_${id.slice(-12)}`;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt,
        notes: {
          land_id: id,
          user_id: user.id,
          product: "BhoomiSetu Premium Land Intelligence",
        },
        capture: "automatic",
      }),
    });

    const order = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      console.error("Razorpay order error:", order);
      return NextResponse.json({ success: false, message: order?.error?.description || "Unable to create payment order." }, { status: 502 });
    }

    const { error: insertError } = await supabase.from("land_purchases").insert({
      user_id: user.id,
      land_id: id,
      razorpay_order_id: order.id,
      amount_inr: price,
      status: "created",
    });

    if (insertError) {
      console.error("Purchase record error:", insertError);
      return NextResponse.json({ success: false, message: "Payment order created but could not be recorded. Please retry." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount,
      currency: "INR",
      keyId,
      productName: land.data.title,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to create payment." },
      { status: 500 }
    );
  }
}
