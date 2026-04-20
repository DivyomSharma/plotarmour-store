import type { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "pa-obsidian-shell",
    slug: "obsidian-shell-tee",
    name: "Obsidian Shell Tee",
    collection: "DROP 01",
    statement: "Core layer / heavy cut / monochrome front",
    description:
      "Dense jersey tee with a front lockup and raw edge attitude built for after-hours wear.",
    price: 3499,
    currency: "INR",
    accent: "#FFFFFF",
    garmentType: "top",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/products/drop-01/obsidian-shell-front.svg",
      "/products/drop-01/obsidian-shell-back.svg",
    ],
  },
  {
    id: "pa-redline-veil",
    slug: "redline-veil-hoodie",
    name: "Redline Veil Hoodie",
    collection: "DROP 01",
    statement: "Oversized shell / scarlet strike / night utility",
    description:
      "Brushed heavyweight hoodie marked by a single red interruption and stripped-back gothic geometry.",
    price: 6899,
    currency: "INR",
    accent: "#FF2A2A",
    garmentType: "outer",
    sizes: ["M", "L", "XL"],
    images: [
      "/products/drop-01/redline-veil-front.svg",
      "/products/drop-01/redline-veil-detail.svg",
    ],
  },
  {
    id: "pa-null-signal",
    slug: "null-signal-cargo",
    name: "Null Signal Cargo",
    collection: "DROP 01",
    statement: "Structured leg / harsh seams / low-light storage",
    description:
      "Wide cargo silhouette with panel cuts, tactical pocket placement, and a blackout finish.",
    price: 5199,
    currency: "INR",
    accent: "#FF2A2A",
    garmentType: "bottom",
    sizes: ["30", "32", "34", "36"],
    images: [
      "/products/drop-01/null-signal-front.svg",
      "/products/drop-01/null-signal-detail.svg",
    ],
  },
];

export function findLocalProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}
