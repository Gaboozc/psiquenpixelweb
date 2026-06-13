import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'catalogo');

export async function GET(request, { params }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    return NextResponse.json({ ...data, slug, content });
  } catch {
    return NextResponse.json({ error: 'Análisis no encontrado' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    const body = await request.json();
    const { game, title, date, genre, excerpt, tags, coverImage, content } = body;

    const frontmatter = {
      title,
      game,
      date: date || new Date().toISOString().split('T')[0],
      slug,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      genre: genre || [],
      tags: tags || [],
    };

    const fileContent = matter.stringify(content || '', frontmatter);
    await fs.writeFile(filePath, fileContent, 'utf8');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error actualizando análisis' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Análisis no encontrado' }, { status: 404 });
  }
}
