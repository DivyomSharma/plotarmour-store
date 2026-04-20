"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";

const TryOnModal = dynamic(() => import("@/components/TryOnModal"), {
  ssr: false,
});

export default function Hero({ featuredProduct }: { featuredProduct: Product }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <>
      <section className="section-shell overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-[1600px] lg:grid-cols-[1.3fr_0.7fr]">
          <div className="poster-grid relative border-b border-line px-4 py-6 sm:px-6 md:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="relative flex h-full flex-col justify-between gap-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="eyebrow text-muted">Streetwear / Editorial / Brutalist</div>
                <div className="eyebrow text-accent">Dark Mode Native</div>
              </div>

              <div className="grid gap-8">
                <div className="relative aspect-[5/2] w-full max-w-[1120px]">
                  <Image
                    src="/brand/plot-armour-lockup-black.png"
                    alt="Plot Armour"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="block object-contain object-left dark:hidden"
                  />
                  <Image
                    src="/brand/plot-armour-lockup-white.png"
                    alt="Plot Armour"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="hidden object-contain object-left dark:block"
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-10">
                  <div className="max-w-xl">
                    <p className="text-sm uppercase tracking-[0.22em] text-muted">
                      DROP 01 / SIGNATURE
                    </p>
                    <p className="mt-4 max-w-md text-[13px] uppercase tracking-[0.18em] text-foreground/72">
                      Raw silhouettes. Hard contrast. Minimal language. Built to feel more like a poster than a storefront.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTryOnOpen(true)}
                      className="pa-button"
                    >
                      Try On
                    </button>
                    <Link href="/drop" className="pa-button-secondary">
                      Enter Drop
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 border-t border-line pt-5 md:grid-cols-3">
                {[
                  "Heavy silhouettes",
                  "Sharp contrast",
                  "AI try-on enabled",
                ].map((line) => (
                  <div
                    key={line}
                    className="text-[11px] uppercase tracking-[0.28em] text-muted"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative overflow-hidden px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,42,42,0.08))]" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <p className="eyebrow text-muted">Featured</p>
                <h2 className="mt-4 text-[5rem] leading-[0.84] sm:text-[6.5rem] lg:text-[8rem]">
                  DROP
                  <br />
                  01
                </h2>
              </div>

              <div className="border border-line bg-surface p-4">
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-black">
                  <Image
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-accent">{featuredProduct.collection}</p>
                    <h3 className="mt-2 text-3xl leading-none">
                      {featuredProduct.name}
                    </h3>
                  </div>
                  <Link
                    href={`/product/${featuredProduct.slug}`}
                    className="pa-button-secondary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TryOnModal
        product={featuredProduct}
        open={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
      />
    </>
  );
}
