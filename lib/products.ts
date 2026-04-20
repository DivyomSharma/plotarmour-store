import { cache } from "react";
import type { Product } from "@/types";
import { PRODUCTS, findLocalProductBySlug } from "@/lib/product-data";
import { getSupabasePublicClient } from "@/lib/supabase";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  statement: string;
  description: string;
  price: number;
  currency: "INR";
  accent: string;
  garment_type: Product["garmentType"];
  sizes: string[];
  images: string[];
};

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    collection: row.collection,
    statement: row.statement,
    description: row.description,
    price: row.price,
    currency: row.currency,
    accent: row.accent,
    garmentType: row.garment_type,
    sizes: row.sizes,
    images: row.images,
  };
}

export const getProducts = cache(async () => {
  const supabase = getSupabasePublicClient();

  if (!supabase) {
    return PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("price");

    if (error || !data?.length) {
      return PRODUCTS;
    }

    return data.map((row) => mapRowToProduct(row as ProductRow));
  } catch {
    return PRODUCTS;
  }
});

export const getProductBySlug = cache(async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? findLocalProductBySlug(slug);
});
