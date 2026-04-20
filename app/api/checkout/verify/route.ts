import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env, hasRazorpayEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

const verificationSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  try {
    if (!hasRazorpayEnv) {
      return NextResponse.json(
        { error: "Razorpay is not configured." },
        { status: 503 },
      );
    }

    const payload = verificationSchema.parse(await request.json());
    const digest = createHmac("sha256", env.razorpayKeySecret!)
      .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
      .digest("hex");

    if (digest.length !== payload.razorpay_signature.length) {
      return NextResponse.json(
        { error: "Payment signature mismatch." },
        { status: 400 },
      );
    }

    const isValid = timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(payload.razorpay_signature),
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment signature mismatch." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      await supabase.from("orders").upsert({
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        verified_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Payment verification failed.",
      },
      { status: 500 },
    );
  }
}
