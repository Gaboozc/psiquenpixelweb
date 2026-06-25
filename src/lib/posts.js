import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

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

// Read a single post with full HTML content (markdown converted)
export const getPostBySlug = (slug) => {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return { ...data, slug, content: marked.parse(content) };
};
