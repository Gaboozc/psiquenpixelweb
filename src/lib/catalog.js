import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'catalogo');

// Read all game analyses, sorted by date descending
export const getAllGames = () => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map((filename) => {
      const raw  = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return { ...data, slug: data.slug ?? filename.replace('.md', '') };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Read a single game analysis with full Markdown content
export const getGameBySlug = (slug) => {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return { ...data, slug, content };
};
