import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type DropGridProps = {
  title: string;
  subtitle: string;
  products: Product[];
};

export default function DropGrid({
  title,
  subtitle,
  products,
}: DropGridProps) {
  return (
    <section className="section-shell content-auto">
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-accent">{subtitle}</p>
            <h2 className="mt-3 text-5xl leading-none sm:text-6xl md:text-8xl">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-[11px] uppercase tracking-[0.28em] text-muted">
            Cut sharp. Hold space. Stay visible only when it matters.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
