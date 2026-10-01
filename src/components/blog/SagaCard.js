import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { sagaCountLabel } from '@/lib/sagaLabels';

// One card standing for a whole saga in the blog grid.
const SagaCard = ({ slug, title, description, coverImage, games = [], totalParts, intro, date }) => (
  <Link href={`/blog/saga/${slug}`} className="block group">
    <article
      className="pixel-border-amber h-full flex flex-col transition-all duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full h-36 bg-brand-bg overflow-hidden relative">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, #16151a 0, #16151a 4px, #0d0d0f 4px, #0d0d0f 8px),
                repeating-linear-gradient(-45deg, rgba(232,144,58,0.06) 0, rgba(232,144,58,0.06) 2px, transparent 2px, transparent 6px)
              `,
            }}
            aria-hidden="true"
          >
            <span className="text-brand-amber/40 text-[10px]" style={{ fontFamily: 'var(--font-pixel)' }}>⚔ ⚔ ⚔</span>
          </div>
        )}
        {/* Stacked-pages hint: this card holds several posts */}
        <span
          className="absolute top-2 right-2 bg-brand-amber text-brand-bg text-[8px] tracking-widest px-2 py-1"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          SAGA
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {games.slice(0, 2).map((g) => <Badge key={g} color="amber">{g}</Badge>)}
          </div>
          {date && (
            <span className="text-brand-muted text-[8px]" style={{ fontFamily: 'var(--font-pixel)' }}>
              {formatDate(date)}
            </span>
          )}
        </div>

        <h3
          className="text-brand-text text-sm leading-snug group-hover:text-brand-amber transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {title}
        </h3>

        {description && (
          <p className="text-brand-muted text-xs leading-relaxed flex-1 font-body line-clamp-3">{description}</p>
        )}

        <p
          className="mt-auto pt-2 border-t border-brand-border text-brand-amber text-[8px] tracking-widest"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {sagaCountLabel({ intro, totalParts })} →
        </p>
      </div>
    </article>
  </Link>
);

export default SagaCard;
