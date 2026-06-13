import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

async function getStats() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const catDir = path.join(process.cwd(), 'src', 'content', 'catalogo');
  const mazFile = path.join(process.cwd(), 'src', 'data', 'mazmorra.json');

  const [blogFiles, catFiles, mazRaw] = await Promise.all([
    fs.readdir(blogDir).catch(() => []),
    fs.readdir(catDir).catch(() => []),
    fs.readFile(mazFile, 'utf8').catch(() => 'null'),
  ]);

  return {
    posts: blogFiles.filter((f) => f.endsWith('.md')).length,
    games: catFiles.filter((f) => f.endsWith('.md')).length,
    mazmorra: JSON.parse(mazRaw),
  };
}

const StatCard = ({ label, value, href, color }) => (
  <Link href={href} className="block group">
    <div className={`pixel-border p-6 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform`}
      style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <span className={`text-[8px] tracking-widest ${color}`} style={{ fontFamily: 'var(--font-pixel)' }}>
        {label}
      </span>
      <span className="text-brand-text text-3xl font-body font-bold">{value}</span>
      <span className="text-brand-muted text-xs font-body group-hover:text-brand-purple transition-colors">
        Gestionar →
      </span>
    </div>
  </Link>
);

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-brand-text text-lg font-body font-bold mb-1">Dashboard</h1>
        <p className="text-brand-muted text-sm font-body">Bienvenido al panel de control de las mazmorras.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="POSTS" value={stats.posts} href="/admin/posts" color="text-brand-purple" />
        <StatCard label="CATÁLOGO" value={stats.games} href="/admin/catalogo" color="text-brand-amber" />
        <StatCard label="SUSCRIPTORES" value="—" href="/admin" color="text-brand-muted" />
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="text-brand-muted text-[9px] tracking-widest mb-4 font-body" style={{ fontFamily: 'var(--font-pixel)' }}>
          ACCIONES RÁPIDAS
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/new"
            className="bg-brand-purple text-white text-xs px-4 py-2 font-body hover:bg-brand-purple-dim transition-colors"
            style={{ boxShadow: '3px 3px 0 #6b3bbf' }}
          >
            + Nuevo Post
          </Link>
          <Link
            href="/admin/catalogo/new"
            className="border border-brand-amber text-brand-amber text-xs px-4 py-2 font-body hover:bg-brand-amber/10 transition-colors"
          >
            + Nuevo Análisis
          </Link>
          <Link
            href="/admin/mazmorra"
            className="border border-brand-border text-brand-muted text-xs px-4 py-2 font-body hover:text-brand-text hover:border-brand-purple transition-colors"
          >
            ⚔ Mazmorra de la Semana
          </Link>
        </div>
      </div>

      {/* Current mazmorra */}
      {stats.mazmorra && (
        <div>
          <h2 className="text-brand-muted text-[9px] tracking-widest mb-4" style={{ fontFamily: 'var(--font-pixel)' }}>
            ⚔ MAZMORRA DE LA SEMANA ACTUAL
          </h2>
          <div className="pixel-border-amber p-4 max-w-md"
            style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <p className="text-brand-amber text-xs font-body font-medium mb-1">{stats.mazmorra.game}</p>
            <p className="text-brand-text text-sm font-body mb-2">{stats.mazmorra.title}</p>
            <p className="text-brand-muted text-xs font-body line-clamp-2">{stats.mazmorra.excerpt}</p>
            <Link href="/admin/mazmorra" className="inline-block mt-3 text-brand-amber text-[9px] hover:underline" style={{ fontFamily: 'var(--font-pixel)' }}>
              Cambiar →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
