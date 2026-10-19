import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '@/components/layout/PageWrapper';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getSaga, getPublishedSagas } from '@/lib/sagas';
import { formatDate } from '@/lib/format';
import { sagaCountLabel } from '@/lib/sagaLabels';

// Regenerate at most once a minute (admin saves also revalidate on demand).
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPublishedSagas()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const saga = await getSaga(slug);
  if (!saga) return { title: 'Saga no encontrada' };
  return {
    title: `Saga: ${saga.title}`,
    description: saga.description || `Saga de ${saga.count} posts en Psique 'n' Pixel.`,
    alternates: { canonical: `/blog/saga/${saga.slug}` },
  };
}

const cardStyle = { backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' };

export default async function SagaPage({ params }) {
  const { slug } = await params;
  const saga = await getSaga(slug);
  if (!saga) notFound();

  const numbered = saga.parts.filter((p) => !p.sagaIntro);

  return (
    <PageWrapper title={saga.title} subtitle={saga.description} accentColor="amber">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        {/* Saga meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            ⚔ SAGA · {sagaCountLabel(saga)}
          </span>
          {saga.games.map((g) => <Badge key={g} color="amber">{g}</Badge>)}
        </div>

        {/* Introduction */}
        {saga.intro && (
          <Link href={`/blog/${saga.intro.slug}`} className="block group">
            <article className="pixel-border-amber overflow-hidden transition-transform group-hover:-translate-y-0.5" style={cardStyle}>
              {saga.intro.coverImage && (
                <div className="relative w-full h-48">
                  <Image src={saga.intro.coverImage} alt={saga.intro.title} fill sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="p-6 flex flex-col gap-3">
                <p className="text-brand-amber text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
                  ★ EMPIEZA AQUÍ · INTRODUCCIÓN
                </p>
                <h2 className="text-brand-text text-lg group-hover:text-brand-amber transition-colors" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  {saga.intro.title}
                </h2>
                {saga.intro.excerpt && <p className="text-brand-muted text-sm font-body leading-relaxed">{saga.intro.excerpt}</p>}
                <span className="text-brand-amber text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
                  LEER INTRODUCCIÓN →
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* Parts, in order */}
        {numbered.length > 0 && (
          <ol className="flex flex-col gap-4">
            {numbered.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="block group">
                  <article className="pixel-border p-5 flex gap-5 items-start transition-transform group-hover:-translate-y-0.5" style={cardStyle}>
                    <span
                      className="shrink-0 w-12 text-center text-brand-amber text-lg leading-none pt-1"
                      style={{ fontFamily: 'var(--font-pixel)' }}
                      aria-hidden="true"
                    >
                      {p.partNumber}
                    </span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <p className="text-brand-muted text-[8px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
                        {p.partLabel.toUpperCase()}{p.date ? ` · ${formatDate(p.date)}` : ''}
                      </p>
                      <h3 className="text-brand-text text-sm group-hover:text-brand-purple transition-colors" style={{ fontFamily: 'var(--font-cinzel)' }}>
                        {p.title}
                      </h3>
                      {p.excerpt && <p className="text-brand-muted text-xs font-body leading-relaxed line-clamp-2">{p.excerpt}</p>}
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div>
          <Button variant="secondary" href="/blog">← VOLVER AL BLOG</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
