export type GarmentType = "top" | "bottom" | "outer" | "dress";

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  statement: string;
  description: string;
  price: number;
  currency: "INR";
  accent: string;
  garmentType: GarmentType;
  sizes: string[];
  images: string[];
};

export type CartItem = {
  slug: string;
  size: string;
  quantity: number;
};

export type CartLineItem = CartItem & {
  product: Product;
};

export type TryOnResult = {
  cacheKey: string;
  resultUrl: string;
  sourceUrl?: string | null;
};
