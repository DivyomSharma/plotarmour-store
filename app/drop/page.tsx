import type { Metadata } from "next";
import DropGrid from "@/components/DropGrid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Drop 01",
};

export default async function DropPage() {
  const products = await getProducts();

  return (
    <div className="content-auto">
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-[1600px] gap-5 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <p className="eyebrow text-accent">Signature</p>
          <h1 className="text-6xl leading-none sm:text-7xl md:text-9xl">
            Drop 01
          </h1>
          <p className="max-w-md text-sm uppercase tracking-[0.18em] text-muted">
            Minimal language. Maximum shape. Everything in this release is built to cut hard against the background.
          </p>
        </div>
      </section>
      <DropGrid title="Drop 01" subtitle="Signature" products={products} />
    </div>
  );
}
