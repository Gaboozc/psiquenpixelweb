import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'catalogo');

export async function GET() {
  try {
    const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
    const games = await Promise.all(
      files.map(async (filename) => {
        const raw = await fs.readFile(path.join(CONTENT_DIR, filename), 'utf8');
        const { data } = matter(raw);
        return { ...data, slug: data.slug ?? filename.replace('.md', '') };
      }),
    );
    games.sort((a, b) => new Date(b.date) - new Date(a.date));
    return NextResponse.json(games);
  } catch {
    return NextResponse.json({ error: 'Error leyendo catálogo' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, game, title, date, genre, excerpt, tags, coverImage, content } = body;

    if (!slug || !game || !title) {
      return NextResponse.json({ error: 'slug, game y title son obligatorios' }, { status: 400 });
    }

    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const filePath = path.join(CONTENT_DIR, `${sanitizedSlug}.md`);

    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    if (exists) {
      return NextResponse.json({ error: 'Ya existe un análisis con ese slug' }, { status: 409 });
    }

    const frontmatter = {
      title,
      game,
      date: date || new Date().toISOString().split('T')[0],
      slug: sanitizedSlug,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      genre: genre || [],
      tags: tags || [],
    };

    const fileContent = matter.stringify(content || '', frontmatter);
    await fs.writeFile(filePath, fileContent, 'utf8');

    return NextResponse.json({ ok: true, slug: sanitizedSlug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error creando análisis' }, { status: 500 });
  }
}
