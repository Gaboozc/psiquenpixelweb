'use client';

import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compra"
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col border-l border-brand-border shadow-2xl"
        style={{ backgroundImage: 'url(/navbar-background.png?v=3)', backgroundSize: '100% 100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border shrink-0">
          <p
            className="text-brand-amber text-[9px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ⚔ INVENTARIO
            {count > 0 && (
              <span className="ml-2 bg-brand-purple text-white text-[7px] px-1.5 py-0.5">
                {count}
              </span>
            )}
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="text-brand-muted hover:text-brand-text text-[9px] transition-colors"
            style={{ fontFamily: 'var(--font-pixel)' }}
            aria-label="Cerrar carrito"
          >
            [X]
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
              <span className="text-5xl opacity-25 select-none">🎒</span>
              <p
                className="text-brand-muted text-[9px] leading-loose"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                Inventario vacío,<br />Héroe.
              </p>
            </div>
          ) : (
            items.map(({ key, product, size, qty }) => (
              <div key={key} className="flex gap-3 pixel-border p-3 bg-brand-bg/40">
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0 text-2xl bg-brand-surface/60 select-none">
                  {product.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-brand-text text-[9px] leading-snug font-body line-clamp-2">
                    {product.name}
                  </p>

                  {size && (
                    <p
                      className="text-brand-purple text-[7px] mt-0.5"
                      style={{ fontFamily: 'var(--font-pixel)' }}
                    >
                      {size}
                    </p>
                  )}

                  {/* Qty controls + price + remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(key, qty - 1)}
                        className="w-5 h-5 text-brand-muted hover:text-brand-text border border-brand-border flex items-center justify-center transition-colors text-xs"
                        style={{ fontFamily: 'var(--font-pixel)' }}
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <span
                        className="text-brand-text text-[9px] w-5 text-center"
                        style={{ fontFamily: 'var(--font-pixel)' }}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(key, qty + 1)}
                        className="w-5 h-5 text-brand-muted hover:text-brand-text border border-brand-border flex items-center justify-center transition-colors text-xs"
                        style={{ fontFamily: 'var(--font-pixel)' }}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="text-brand-amber text-[9px]"
                        style={{ fontFamily: 'var(--font-pixel)' }}
                      >
                        €{(product.price * qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(key)}
                        className="text-brand-border hover:text-red-400 text-[9px] transition-colors"
                        style={{ fontFamily: 'var(--font-pixel)' }}
                        aria-label={`Eliminar ${product.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — only when there are items */}
        {items.length > 0 && (
          <div className="border-t border-brand-border px-5 py-4 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <span
                className="text-brand-muted text-[9px] tracking-widest"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                TOTAL
              </span>
              <span
                className="text-brand-amber text-base"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                €{total.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full bg-brand-purple text-white text-[9px] tracking-widest py-3 hover:bg-brand-purple-dim transition-colors"
              style={{ fontFamily: 'var(--font-pixel)', boxShadow: '3px 3px 0 #6b3bbf' }}
            >
              PROCEDER AL PAGO ⚔
            </button>

            <button
              onClick={clearCart}
              className="w-full text-brand-border text-[8px] tracking-widest py-1 hover:text-brand-muted transition-colors"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              vaciar inventario
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
