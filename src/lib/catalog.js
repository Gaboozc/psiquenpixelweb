import {
  listPublished, getPublished, rowToGame, adjacentOf, relatedOf, tagsOf, byTag,
} from './articles';

const TABLE = 'games';

// Published game analyses, newest first (cards only — no body).
export const getAllGames = ({ limit } = {}) => listPublished(TABLE, rowToGame, { limit });

// One published analysis with its body rendered to HTML.
export const getGameBySlug = (slug) => getPublished(TABLE, rowToGame, slug);

export const getAdjacentGames = async (slug) => adjacentOf(await getAllGames(), slug);

export const getRelatedGames = async (slug, limit = 3) => relatedOf(await getAllGames(), slug, limit);

export const getAllGameTags = async () => tagsOf(await getAllGames());

export const getGamesByTag = async (tag) => byTag(await getAllGames(), tag);
