'use client';

import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import ProductCard from '@/components/merch/ProductCard';
import CartDrawer from '@/components/merch/CartDrawer';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useCart } from '@/context/CartContext';

// ---------------------------------------------------------------------------
// Floating cart button
// ---------------------------------------------------------------------------
function CartButton() {
  const { count, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label={`Abrir inventario — ${count} artículos`}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-brand-purple text-white text-[8px] tracking-widest px-4 py-3 hover:bg-brand-purple-dim transition-all duration-150 hover:-translate-y-0.5"
      style={{ fontFamily: 'var(--font-pixel)', boxShadow: '4px 4px 0 #6b3bbf' }}
    >
      ⚔ INVENTARIO
      {count > 0 && (
        <span className="bg-brand-amber text-brand-bg text-[7px] px-1.5 py-0.5 leading-none font-bold">
          {count}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Merch page
// ---------------------------------------------------------------------------
export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState('todos');

  const filtered = activeCategory === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <>
      <PageWrapper
        title="La Forja"
        subtitle="Equipamiento oficial del Héroe de las Mazmorras"
        accentColor="amber"
      >

        {/* ── Category filter ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-[8px] tracking-widest px-3 py-2 border transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-amber text-brand-bg border-brand-amber'
                  : 'border-brand-border text-brand-muted hover:border-brand-amber hover:text-brand-amber'
              }`}
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              {cat.label}
            </button>
          ))}

          {/* Result count */}
          <span
            className="ml-auto self-center text-brand-muted text-[8px]"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {filtered.length} artículos
          </span>
        </div>

        {/* ── Product grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ── Demo notice ──────────────────────────────────────────────── */}
        <div
          className="mt-14 pixel-border-purple p-5 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p
            className="text-brand-purple text-[8px] tracking-widest mb-1"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ⚠ MODO DEMO
          </p>
          <p className="text-brand-muted text-xs font-body">
            Tienda en construcción — sin pasarela de pago real. Los artículos son mockup.
          </p>
        </div>

      </PageWrapper>

      <CartDrawer />
      <CartButton />
    </>
  );
}
