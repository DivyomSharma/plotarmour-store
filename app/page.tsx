import DropGrid from "@/components/DropGrid";
import Hero from "@/components/Hero";
import TryOnTeaser from "@/components/TryOnTeaser";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  const featuredProduct = products[1] ?? products[0];

  return (
    <>
      <Hero featuredProduct={featuredProduct} />
      <DropGrid title="DROP 01" subtitle="Signature" products={products} />
      <TryOnTeaser product={featuredProduct} />
    </>
  );
}
