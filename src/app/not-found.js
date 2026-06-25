import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 dungeon-bg">
      <div
        className="w-full max-w-lg pixel-border p-10 text-center flex flex-col items-center gap-6"
        style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Pixel art death screen */}
        <p
          className="text-brand-purple text-[9px] tracking-widest"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ✦ ERROR ✦
        </p>

        <div className="space-y-1">
          <p
            className="text-brand-text text-2xl leading-none"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            404
          </p>
          <p
            className="text-brand-amber text-[9px] tracking-widest"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            YOU DIED
          </p>
        </div>

        <div className="border-t border-brand-border w-full" />

        <p
          className="text-brand-muted text-[8px] tracking-widest leading-loose"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          Esta página no existe<br />en las mazmorras de la mente.
        </p>

        <p className="text-brand-muted text-xs font-body leading-relaxed max-w-xs">
          El camino que buscas se ha desvanecido en la niebla. Regresa al inicio o elige otro destino.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button variant="primary" href="/">VOLVER AL INICIO</Button>
          <Button variant="secondary" href="/blog">IR AL BLOG</Button>
        </div>

        <Link
          href="/catalogo"
          className="text-brand-muted text-[8px] tracking-widest hover:text-brand-amber transition-colors"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ⚔ o explorar el catálogo →
        </Link>
      </div>
    </div>
  );
}
