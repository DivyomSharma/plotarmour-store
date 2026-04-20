"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
} from "react";
import { findLocalProductBySlug } from "@/lib/product-data";
import type { CartItem, CartLineItem } from "@/types";

const STORAGE_KEY = "plot-armour-cart:v1";

type CartContextValue = {
  items: CartLineItem[];
  isHydrated: boolean;
  totalItems: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readInitialCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as { version: number; items: CartItem[] };
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<CartItem[]>(readInitialCart);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: rawItems,
      }),
    );
  }, [isHydrated, rawItems]);

  const items = useMemo<CartLineItem[]>(() => {
    return rawItems.flatMap((item) => {
      const product = findLocalProductBySlug(item.slug);

      if (!product) {
        return [];
      }

      return [{ ...item, product }];
    });
  }, [rawItems]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  function addItem(item: CartItem) {
    setRawItems((current) => {
      const existingIndex = current.findIndex(
        (entry) => entry.slug === item.slug && entry.size === item.size,
      );

      if (existingIndex === -1) {
        return [...current, item];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry,
      );
    });
  }

  function removeItem(slug: string, size: string) {
    setRawItems((current) =>
      current.filter((item) => !(item.slug === slug && item.size === size)),
    );
  }

  function updateQuantity(slug: string, size: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(slug, size);
      return;
    }

    setRawItems((current) =>
      current.map((item) =>
        item.slug === slug && item.size === size ? { ...item, quantity } : item,
      ),
    );
  }

  function clearCart() {
    setRawItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        totalItems,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
