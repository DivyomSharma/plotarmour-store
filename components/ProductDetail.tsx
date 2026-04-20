"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";

const TryOnModal = dynamic(() => import("@/components/TryOnModal"), {
  ssr: false,
});

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <>
      <section className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
        <div className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-black">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`relative aspect-[4/5] overflow-hidden border ${
                  index === activeImage ? "border-foreground" : "border-line"
                } bg-black`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-6 border border-line bg-surface p-5 sm:p-7">
            <div className="border-b border-line pb-5">
              <p className="eyebrow text-accent">{product.collection}</p>
              <h1 className="mt-4 text-5xl leading-none sm:text-6xl">
                {product.name}
              </h1>
              <div className="mt-5 text-2xl font-medium text-foreground">
                {formatPrice(product.price)}
              </div>
              <p className="mt-4 max-w-lg text-sm uppercase tracking-[0.16em] text-muted">
                {product.description}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">
                Size
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border px-3 py-3 text-sm font-semibold uppercase tracking-[0.2em] ${
                      size === selectedSize
                        ? "border-foreground bg-foreground text-background"
                        : "border-line bg-transparent text-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setIsTryOnOpen(true)}
                className="pa-button"
              >
                Try On
              </button>
              <button
                type="button"
                onClick={() =>
                  addItem({ slug: product.slug, size: selectedSize, quantity: 1 })
                }
                className="pa-button-secondary"
              >
                Add To Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addItem({ slug: product.slug, size: selectedSize, quantity: 1 });
                  router.push("/cart");
                }}
                className="pa-button-secondary"
              >
                Buy Now
              </button>
            </div>

            <div className="border-t border-line pt-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
                {product.statement}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <TryOnModal
        product={product}
        open={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
      />
    </>
  );
}
