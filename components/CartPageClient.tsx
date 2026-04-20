"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

type CheckoutPayload = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function loadRazorpayScript() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPageClient() {
  const router = useRouter();
  const {
    items,
    isHydrated,
    totalAmount,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    try {
      setIsCheckingOut(true);
      setError(null);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const orderResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      const orderPayload = (await orderResponse.json()) as CheckoutPayload & {
        error?: string;
      };

      if (!orderResponse.ok) {
        throw new Error(orderPayload.error ?? "Unable to create order.");
      }

      const razorpay = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        name: "Plot Armour",
        description: "DROP 01 checkout",
        order_id: orderPayload.orderId,
        theme: {
          color: "#FF2A2A",
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verification = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            const verificationPayload = (await verification.json()) as {
              verified?: boolean;
              error?: string;
            };

            if (!verification.ok || !verificationPayload.verified) {
              throw new Error(
                verificationPayload.error ?? "Payment verification failed.",
              );
            }

            clearCart();
            router.push(
              `/checkout/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`,
            );
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed.",
            );
          }
        },
      });

      razorpay.open();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="border border-line bg-surface px-5 py-8 text-sm uppercase tracking-[0.2em] text-muted">
          Loading cart
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-5 border border-line bg-surface px-5 py-8 sm:px-8">
          <p className="eyebrow text-accent">Cart</p>
          <h1 className="text-5xl leading-none sm:text-6xl">No Noise Yet</h1>
          <p className="max-w-md text-sm uppercase tracking-[0.18em] text-muted">
            Your bag is empty. Pull something from Drop 01.
          </p>
          <Link href="/drop" className="pa-button w-fit">
            View Drop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
      <section className="grid gap-4">
        <div className="border border-line bg-surface px-5 py-5">
          <p className="eyebrow text-accent">Cart</p>
          <h1 className="mt-3 text-5xl leading-none sm:text-6xl">Bag</h1>
        </div>

        {items.map((item) => (
          <article
            key={`${item.slug}-${item.size}`}
            className="grid gap-4 border border-line bg-surface p-4 sm:grid-cols-[180px_1fr]"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-black">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow text-muted">{item.product.collection}</p>
                  <h2 className="mt-2 text-3xl leading-none">{item.product.name}</h2>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-muted">
                    Size {item.size}
                  </p>
                </div>
                <div className="text-lg font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.slug, item.size, item.quantity - 1)
                  }
                  className="border border-line px-3 py-2 text-xs uppercase tracking-[0.26em] hover:border-foreground"
                >
                  -
                </button>
                <span className="min-w-12 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.slug, item.size, item.quantity + 1)
                  }
                  className="border border-line px-3 py-2 text-xs uppercase tracking-[0.26em] hover:border-foreground"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug, item.size)}
                  className="border border-line px-3 py-2 text-xs uppercase tracking-[0.26em] text-muted hover:border-accent hover:text-accent"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid gap-6 border border-line bg-surface p-5 sm:p-7">
          <div className="border-b border-line pb-5">
            <p className="eyebrow text-accent">Checkout</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h2 className="text-4xl leading-none">Total</h2>
              <div className="text-2xl font-medium">{formatPrice(totalAmount)}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="pa-button"
          >
            {isCheckingOut ? "Opening Checkout" : "Pay With Razorpay"}
          </button>
          {error ? (
            <p className="border border-accent/40 bg-accent/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-foreground">
              {error}
            </p>
          ) : null}
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Tax and shipping can be added inside your live Razorpay flow.
          </p>
        </div>
      </aside>
    </div>
  );
}
