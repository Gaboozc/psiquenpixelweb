import PageWrapper from '@/components/layout/PageWrapper';
import GameCard from '@/components/catalogo/GameCard';

export const metadata = {
  title: 'Catálogo',
  description: 'Análisis de videojuegos desde una perspectiva psicológica, narrativa y cultural.',
};

// Placeholder data — replace with getAllGames() from @/lib/catalog
const GAMES = [
  {
    slug:    'elden-ring',
    game:    'Elden Ring',
    title:   'El Vacío del Poder: Trauma y Soberanía en las Tierras Intermedias',
    excerpt: 'FromSoftware construye un mundo donde cada gobernante está roto. Analizamos la psicología del poder corrompido y la búsqueda de sentido en un cosmos indiferente.',
    date:    '2025-04-20',
    genre:   ['RPG de Acción'],
    tags:    ['trauma', 'poder', 'mitos'],
  },
  {
    slug:    'celeste',
    game:    'Celeste',
    title:   'Subir la Montaña: Ansiedad, Automedicación y Aceptación',
    excerpt: 'Celeste es el relato más honesto sobre ansiedad y salud mental que ha producido el medio. Desglosamos sus mecánicas como lenguaje terapéutico.',
    date:    '2025-03-05',
    genre:   ['Plataformas'],
    tags:    ['ansiedad', 'salud-mental', 'indie'],
  },
  {
    slug:    'disco-elysium',
    game:    'Disco Elysium',
    title:   'El Detective Roto: Adicción, Ideología y Reconstrucción del Yo',
    excerpt: 'Disco Elysium es una novela policíaca sobre un hombre que no recuerda quién es. Exploramos su psicología, su política y su desolación existencial.',
    date:    '2025-02-01',
    genre:   ['RPG'],
    tags:    ['adiccion', 'ideologia', 'identidad'],
  },
];

export default function CatalogoPage() {
  return (
    <PageWrapper
      title="Catálogo"
      subtitle="Análisis psicológico, narrativo y cultural de videojuegos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game) => (
          <GameCard key={game.slug} {...game} />
        ))}
      </div>
    </PageWrapper>
  );
}
