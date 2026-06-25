'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items,  setItems]  = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready,  setReady]  = useState(false);

  // Rehydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pnp-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('pnp-cart', JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((product, size, qty = 1) => {
    const key = `${product.id}__${size ?? 'one-size'}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, product, size, qty }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
