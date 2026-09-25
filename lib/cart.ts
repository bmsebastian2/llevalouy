"use client";

import { useSyncExternalStore } from "react";
import { MAX_ITEMS, MAX_QUANTITY } from "@/types/order";

// Carrito del navegador. Guarda solo slug y cantidad: nombre y precio se leen siempre del catálogo
// actual, y el servidor recalcula todo al confirmar. Si el navegador bloquea el almacenamiento,
// el carrito funciona igual mientras la pestaña esté abierta.

export type CartItem = { slug: string; quantity: number };

const KEY = "llevalo-carrito";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter(
        (it): it is CartItem =>
          typeof it?.slug === "string" && Number.isInteger(it?.quantity) && it.quantity >= 1,
      )
      .map((it) => ({ slug: it.slug, quantity: Math.min(MAX_QUANTITY, it.quantity) }))
      .slice(0, MAX_ITEMS);
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  items = read();
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento: queda solo en memoria
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  // Otra pestaña cambió el carrito
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    items = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return items;
}

/** En el servidor y durante la hidratación el carrito está vacío; después se completa. */
export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** false en el servidor y en el primer render: sirve para no mostrar "carrito vacío" antes de leerlo. */
export function useCartReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export const cart = {
  /** Suma unidades. Devuelve false si el carrito ya tiene el máximo de productos distintos. */
  add(slug: string, quantity = 1): boolean {
    ensureLoaded();
    const found = items.find((it) => it.slug === slug);
    if (found) {
      commit(items.map((it) => (it.slug === slug ? { slug, quantity: Math.min(MAX_QUANTITY, it.quantity + quantity) } : it)));
      return true;
    }
    if (items.length >= MAX_ITEMS) return false;
    commit([...items, { slug, quantity: Math.min(MAX_QUANTITY, quantity) }]);
    return true;
  },
  set(slug: string, quantity: number) {
    ensureLoaded();
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    if (items.some((it) => it.slug === slug)) commit(items.map((it) => (it.slug === slug ? { slug, quantity: q } : it)));
    else if (items.length < MAX_ITEMS) commit([...items, { slug, quantity: q }]);
  },
  remove(slug: string) {
    ensureLoaded();
    commit(items.filter((it) => it.slug !== slug));
  },
  /** Saca productos que ya no están a la venta */
  keepOnly(slugs: string[]) {
    ensureLoaded();
    const next = items.filter((it) => slugs.includes(it.slug));
    if (next.length !== items.length) commit(next);
  },
  clear() {
    commit(EMPTY);
  },
};
