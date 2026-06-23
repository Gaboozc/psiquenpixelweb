import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'catalogo');

// Read all game analyses, sorted by date descending
export const getAllGames = ({ limit } = {}) => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  const games = files
    .map((filename) => {
      const raw  = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return { ...data, slug: data.slug ?? filename.replace('.md', '') };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return limit ? games.slice(0, limit) : games;
};

// Read a single game analysis with full HTML content (markdown converted)
export const getGameBySlug = (slug) => {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return { ...data, slug, content: marked.parse(content) };
};
