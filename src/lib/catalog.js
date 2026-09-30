import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { readingTime, withHeadingIds } from './reading';

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
    .filter((g) => g.published !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return limit ? games.slice(0, limit) : games;
};

// Return { prev, next } neighbors for a slug (sorted newest-first, so prev=older, next=newer)
export const getAdjacentGames = (slug) => {
  const games = getAllGames();
  const idx = games.findIndex((g) => g.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? games[idx - 1] : null,
    prev: idx < games.length - 1 ? games[idx + 1] : null,
  };
};

// Games sharing the most tags with the given slug (excludes drafts and itself)
export const getRelatedGames = (slug, limit = 3) => {
  const games = getAllGames();
  const current = games.find((g) => g.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.tags ?? []);

  return games
    .filter((g) => g.slug !== slug)
    .map((g) => ({
      game: g,
      score: (g.tags ?? []).filter((t) => currentTags.has(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.game.date) - new Date(a.game.date))
    .slice(0, limit)
    .map((x) => x.game);
};

// Unique, sorted list of all tags across published games
export const getAllGameTags = () => {
  const tags = new Set();
  getAllGames().forEach((g) => (g.tags ?? []).forEach((t) => tags.add(t)));
  return [...tags].sort((a, b) => a.localeCompare(b, 'es'));
};

// All published games carrying a given tag (case-insensitive)
export const getGamesByTag = (tag) => {
  const needle = String(tag).toLowerCase();
  return getAllGames().filter((g) =>
    (g.tags ?? []).some((t) => t.toLowerCase() === needle),
  );
};

// Read a single game analysis with full HTML content (markdown converted)
export const getGameBySlug = (slug) => {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  const { html, headings } = withHeadingIds(marked.parse(content));

  return {
    ...data,
    slug,
    content: html,
    headings,
    readingTime: readingTime(content),
  };
};
