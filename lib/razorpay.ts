import Razorpay from "razorpay";
import { env, hasRazorpayEnv } from "@/lib/env";

let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance() {
  if (!hasRazorpayEnv) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: env.razorpayKeyId!,
      key_secret: env.razorpayKeySecret!,
    });
  }

  return razorpayInstance;
}
