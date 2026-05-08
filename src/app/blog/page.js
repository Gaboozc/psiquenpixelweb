import PageWrapper from '@/components/layout/PageWrapper';
import ArticleCard from '@/components/blog/ArticleCard';

export const metadata = {
  title: 'Blog',
  description: 'Artículos de análisis psicológico, narrativo y cultural de videojuegos.',
};

// Placeholder data — replace with getAllPosts() from @/lib/posts
const ARTICLES = [
  {
    slug:     'zelda-disociacion',
    title:    'Link y la Disociación: Héroes sin Yo',
    excerpt:  'Exploramos cómo la amnesia recurrente de Link en la saga Zelda refleja mecanismos psicológicos de disociación y la construcción fragmentada de la identidad heroica.',
    date:     '2025-04-10',
    category: 'Psicología',
    tags:     ['zelda', 'identidad', 'disociacion'],
  },
  {
    slug:     'dark-souls-duelo',
    title:    'Dark Souls como Metáfora del Duelo',
    excerpt:  'Las hogueras, los huecos y la persistencia en Dark Souls no son solo mecánicas de juego; son una alegoría perfecta de las cinco etapas del duelo.',
    date:     '2025-03-22',
    category: 'Narrativa',
    tags:     ['dark-souls', 'duelo', 'fromsoft'],
  },
  {
    slug:     'hades-terapia',
    title:    '¿Puede Hades reemplazar a un terapeuta?',
    excerpt:  'El rogue-like de Supergiant Games usa la repetición como catarsis. Analizamos cómo sus sistemas narrativos imitan procesos terapéuticos reales.',
    date:     '2025-02-15',
    category: 'Análisis',
    tags:     ['hades', 'terapia', 'roguelike'],
  },
];

export default function BlogPage() {
  return (
    <PageWrapper
      title="Blog"
      subtitle="Análisis psicológico, narrativo y cultural de videojuegos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <ArticleCard key={article.slug} {...article} />
        ))}
      </div>
    </PageWrapper>
  );
}
