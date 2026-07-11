import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { readingTime, withHeadingIds } from './reading';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

// Read all post frontmatter, sorted by date descending
export const getAllPosts = ({ limit } = {}) => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const raw  = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return { ...data, slug: data.slug ?? filename.replace('.md', '') };
    })
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return limit ? posts.slice(0, limit) : posts;
};

// Return { prev, next } neighbors for a slug (sorted newest-first, so prev=older, next=newer)
export const getAdjacentPosts = (slug) => {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? posts[idx - 1] : null,
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
};

// Posts sharing the most tags with the given slug (excludes drafts and itself)
export const getRelatedPosts = (slug, limit = 3) => {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.tags ?? []);

  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: (p.tags ?? []).filter((t) => currentTags.has(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map((x) => x.post);
};

// Unique, sorted list of all tags across published posts
export const getAllTags = () => {
  const tags = new Set();
  getAllPosts().forEach((p) => (p.tags ?? []).forEach((t) => tags.add(t)));
  return [...tags].sort((a, b) => a.localeCompare(b, 'es'));
};

// All published posts carrying a given tag (case-insensitive)
export const getPostsByTag = (tag) => {
  const needle = String(tag).toLowerCase();
  return getAllPosts().filter((p) =>
    (p.tags ?? []).some((t) => t.toLowerCase() === needle),
  );
};

// Read a single post with full HTML content (markdown converted)
export const getPostBySlug = (slug) => {
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
