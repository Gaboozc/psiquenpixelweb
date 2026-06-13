import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Merch',
  description: "Tienda oficial de Psique 'n' Pixel — Próximamente.",
};

const MERCH_ITEMS = [
  {
    id: 'tshirt',
    name: 'Camiseta "Las Mazmorras de la Mente"',
    description: 'Diseño pixel art exclusivo. 100% algodón.',
    icon: '👕',
  },
  {
    id: 'poster',
    name: 'Póster "Árbol de Almas"',
    description: 'Ilustración de alta resolución, 50x70 cm.',
    icon: '🗺️',
  },
  {
    id: 'mug',
    name: 'Taza Héroe de Mazmorra',
    description: 'Taza cerámica con diseño pixel art. 350 ml.',
    icon: '☕',
  },
  {
    id: 'stickers',
    name: 'Pack de Pegatinas RPG',
    description: '12 pegatinas de vinilo de personajes y símbolos.',
    icon: '🎖️',
  },
];

export default function MerchPage() {
  return (
    <PageWrapper
      title="Merch"
      subtitle="Equipamiento del Héroe — Próximamente en la Tienda"
      accentColor="amber"
    >
      {/* Coming soon banner */}
      <div className="mb-12 pixel-border-amber p-8 text-center flex flex-col items-center gap-4"
        style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <p
          className="text-brand-amber text-[9px] tracking-widest"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ⚔ FORJA EN CONSTRUCCIÓN ⚔
        </p>
        <h2
          className="text-brand-text text-base md:text-lg"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          La Tienda Abre Pronto
        </h2>
        <p className="text-brand-muted text-sm font-body max-w-md leading-relaxed">
          Estamos forjando el equipamiento digno de un héroe de las mazmorras de la mente.
          Suscríbete a la newsletter para ser el primero en saber cuándo abre la tienda.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="secondary" href="/#newsletter">
            NOTIFICARME ⚔
          </Button>
        </div>
      </div>

      {/* Preview grid */}
      <div>
        <p
          className="text-brand-muted text-[9px] tracking-widest text-center mb-8"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          ▓ PRÓXIMOS ARTÍCULOS ▓
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MERCH_ITEMS.map((item) => (
            <div
              key={item.id}
              className="pixel-border p-6 flex flex-col items-center gap-4 text-center opacity-60"
              style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <span className="text-4xl">{item.icon}</span>
              <h3
                className="text-brand-text text-xs leading-snug"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                {item.name}
              </h3>
              <p className="text-brand-muted text-xs font-body leading-relaxed flex-1">
                {item.description}
              </p>
              <span
                className="text-brand-border text-[8px] tracking-widest"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                PRÓXIMAMENTE
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
