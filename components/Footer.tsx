import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-8 text-[11px] uppercase tracking-[0.28em] text-muted sm:px-6 md:grid-cols-3 lg:px-10">
        <div className="text-foreground">Plot Armour</div>
        <div className="flex flex-wrap gap-4">
          <Link href="/drop" className="hover:text-foreground">
            Drop 01
          </Link>
          <Link href="/cart" className="hover:text-foreground">
            Cart
          </Link>
        </div>
        <div className="md:text-right">Built For Low Light</div>
      </div>
    </footer>
  );
}
