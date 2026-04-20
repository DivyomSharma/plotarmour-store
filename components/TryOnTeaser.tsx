"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Product } from "@/types";

const TryOnModal = dynamic(() => import("@/components/TryOnModal"), {
  ssr: false,
});

export default function TryOnTeaser({ product }: { product: Product }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <>
      <section className="section-shell content-auto">
        <div className="mx-auto grid w-full max-w-[1600px] gap-px bg-line lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-background px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <p className="eyebrow text-accent">Try On Preview</p>
            <h2 className="mt-4 text-5xl leading-none sm:text-6xl md:text-8xl">
              See The
              <br />
              Fit First
            </h2>
            <p className="mt-5 max-w-md text-[13px] uppercase tracking-[0.18em] text-muted">
              Upload a portrait, generate the look, keep the result, then move straight into checkout.
            </p>
            <button
              type="button"
              onClick={() => setIsTryOnOpen(true)}
              className="pa-button mt-8"
            >
              Open Try On
            </button>
          </div>

          <div className="grid gap-px bg-line md:grid-cols-3">
            {["Model", "Garment", "Result"].map((label, index) => (
              <div
                key={label}
                className="bg-background px-4 py-4 sm:px-6 lg:px-8"
              >
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                  {label}
                </div>
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-black">
                  <Image
                    src={index === 0 ? "/brand/plot-armour-mark.png" : product.images[Math.min(index - 1, product.images.length - 1)]}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={index === 0 ? "object-contain p-8" : "object-cover"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TryOnModal
        product={product}
        open={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
      />
    </>
  );
}
