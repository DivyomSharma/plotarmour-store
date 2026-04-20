"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group border border-line bg-surface"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden border-b border-line bg-black">
          <motion.div
            variants={{
              rest: { scale: 1, opacity: 1 },
              hover: { scale: 1.04, opacity: 0.94 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/78 via-black/18 to-transparent p-5"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              View
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              Try On Ready
            </span>
          </motion.div>
        </div>
        <div className="grid gap-3 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">{product.collection}</p>
              <h3 className="mt-2 text-[1.6rem] leading-none text-foreground">
                {product.name}
              </h3>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            {product.statement}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
