"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/components/providers/CartProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/drop", label: "Drop 01" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const { totalItems, isHydrated } = useCart();

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-line bg-background/88 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden border border-line">
            <Image
              src="/brand/plot-armour-mark.png"
              alt="Plot Armour mark"
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
          <div className="relative hidden h-7 w-[172px] sm:block">
            <Image
              src="/brand/plot-armour-lockup-black.png"
              alt="Plot Armour"
              fill
              sizes="172px"
              className="block object-contain dark:hidden"
              priority
            />
            <Image
              src="/brand/plot-armour-lockup-white.png"
              alt="Plot Armour"
              fill
              sizes="172px"
              className="hidden object-contain dark:block"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-transparent px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted hover:border-line hover:text-foreground"
              >
                {link.label}
                {link.href === "/cart" ? ` (${isHydrated ? totalItems : 0})` : ""}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
