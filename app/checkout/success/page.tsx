import type { Metadata } from "next";

type SuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
    paymentId?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId, paymentId } = await searchParams;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="grid gap-6 border border-line bg-surface p-6 sm:p-8">
        <p className="eyebrow text-accent">Payment Confirmed</p>
        <h1 className="text-5xl leading-none sm:text-7xl">Order Locked</h1>
        <p className="max-w-lg text-sm uppercase tracking-[0.18em] text-muted">
          Your checkout is complete. Plot Armour will move next.
        </p>
        <div className="grid gap-3 border-t border-line pt-5 text-[11px] uppercase tracking-[0.26em] text-muted">
          <div>Order ID: {orderId ?? "Pending"}</div>
          <div>Payment ID: {paymentId ?? "Pending"}</div>
        </div>
      </div>
    </section>
  );
}
