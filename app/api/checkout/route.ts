import { NextResponse } from "next/server";
import { z } from "zod";
import { env, hasRazorpayEnv } from "@/lib/env";
import { findLocalProductBySlug } from "@/lib/product-data";
import { getRazorpayInstance } from "@/lib/razorpay";

export const runtime = "nodejs";

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string(),
        size: z.string(),
        quantity: z.number().int().positive().max(10),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    if (!hasRazorpayEnv) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
        { status: 503 },
      );
    }

    const payload = requestSchema.parse(await request.json());
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      throw new Error("Razorpay client could not be created.");
    }

    const amount = payload.items.reduce((sum, item) => {
      const product = findLocalProductBySlug(item.slug);

      if (!product) {
        throw new Error(`Unknown product: ${item.slug}`);
      }

      return sum + product.price * item.quantity;
    }, 0);

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `plot-armour-${Date.now()}`,
      notes: {
        drop: "DROP 01",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpayKeyId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Checkout initialization failed.",
      },
      { status: 500 },
    );
  }
}
