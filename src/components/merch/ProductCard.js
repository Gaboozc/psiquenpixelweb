'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';

const BADGE_COLOR = {
  'NUEVO':       'purple',
  'BESTSELLER':  'amber',
  'ED. LIMITADA':'purple',
  'MAGIA':       'amber',
  'GAMER':       'amber',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  // Default to middle size if sizes available
  const defaultSize = product.sizes
    ? product.sizes[Math.floor(product.sizes.length / 2)]
    : null;

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [added,        setAdded]        = useState(false);

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article
      className="pixel-border flex flex-col h-full group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform duration-150"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full h-44 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, #16151a 0, #16151a 4px, #0d0d0f 4px, #0d0d0f 8px),
            repeating-linear-gradient(-45deg, rgba(155,89,247,0.06) 0, rgba(155,89,247,0.06) 2px, transparent 2px, transparent 6px)
          `,
        }}
        aria-hidden="true"
      >
        <span className="text-5xl select-none">{product.icon}</span>

        {product.badge && (
          <div className="absolute top-2 right-2">
            <Badge color={BADGE_COLOR[product.badge] ?? 'purple'}>{product.badge}</Badge>
          </div>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <span
              className="text-brand-amber text-[7px] tracking-widest"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              ¡Solo {product.stock} ud.!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category label */}
        <p
          className="text-brand-muted text-[7px] tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {product.category}
        </p>

        {/* Product name */}
        <h3
          className="text-brand-text text-sm leading-snug group-hover:text-brand-purple transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-brand-muted text-xs leading-relaxed font-body flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Color variants */}
        {product.colors && (
          <p className="text-brand-muted text-[8px] font-body">
            {product.colors.join(' · ')}
          </p>
        )}

        {/* Size picker */}
        {product.sizes && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2 py-0.5 text-[8px] border transition-colors ${
                  selectedSize === s
                    ? 'border-brand-purple text-brand-purple bg-brand-purple/10'
                    : 'border-brand-border text-brand-muted hover:border-brand-muted'
                }`}
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-brand-border">
          <span
            className="text-brand-amber text-sm"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            €{product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`text-[8px] tracking-widest px-3 py-2 transition-all duration-150 ${
              product.stock === 0
                ? 'border border-brand-border text-brand-border cursor-not-allowed'
                : added
                  ? 'bg-brand-purple text-white border border-brand-purple'
                  : 'border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white'
            }`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {product.stock === 0 ? 'AGOTADO' : added ? '✓ AÑADIDO' : '+ AÑADIR'}
          </button>
        </div>
      </div>
    </article>
  );
}
