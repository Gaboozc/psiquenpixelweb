import {
  listPublished, getPublished, rowToPost, adjacentOf, relatedOf, tagsOf, byTag,
} from './articles';

const TABLE = 'posts';

// Published posts, newest first (cards only — no body).
export const getAllPosts = ({ limit } = {}) => listPublished(TABLE, rowToPost, { limit });

// One published post with its body rendered to HTML.
export const getPostBySlug = (slug) => getPublished(TABLE, rowToPost, slug);

export const getAdjacentPosts = async (slug) => adjacentOf(await getAllPosts(), slug);

export const getRelatedPosts = async (slug, limit = 3) => relatedOf(await getAllPosts(), slug, limit);

export const getAllTags = async () => tagsOf(await getAllPosts());

export const getPostsByTag = async (tag) => byTag(await getAllPosts(), tag);
