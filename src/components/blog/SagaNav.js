import Link from 'next/link';

// Box shown at the top of a post that belongs to a saga: where we are
// ("Parte 2 de 4" / "Introducción") plus the full list of parts.
export default function SagaNav({ context }) {
  const { saga, current } = context;
  const position = current.sagaIntro
    ? 'Introducción'
    : `Parte ${current.partNumber} de ${saga.totalParts}`;

  return (
    <aside
      className="pixel-border-amber p-4 mb-10"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      aria-label={`Saga ${saga.title}`}
    >
      <details>
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 flex-wrap">
          <span className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            ⚔ SAGA ·{' '}
            <Link href={`/blog/saga/${saga.slug}`} className="hover:underline">{saga.title}</Link>
          </span>
          <span className="text-brand-text text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            {position.toUpperCase()} ▾
          </span>
        </summary>

        <ol className="mt-4 flex flex-col gap-1">
          {saga.parts.map((p) => {
            const isCurrent = p.slug === current.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`flex gap-3 items-baseline px-2 py-1.5 font-body text-xs transition-colors ${
                    isCurrent ? 'bg-brand-amber/15 text-brand-amber' : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <span className="w-32 shrink-0 text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
                    {p.partLabel.toUpperCase()}
                  </span>
                  <span className="line-clamp-1">{p.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </aside>
  );
}
