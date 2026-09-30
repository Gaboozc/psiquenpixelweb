import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'media.json');

export const DEFAULT_MEDIA = {
  youtube: {
    description: '',
    features: [],
    comingSoon: true,
    embedUrl: '',
    channelId: '',
  },
  spotify: {
    description: '',
    features: [],
    comingSoon: true,
    embedUrl: '',
  },
};

function mergeSection(def, incoming = {}) {
  return {
    description: incoming.description ?? def.description,
    features: Array.isArray(incoming.features) ? incoming.features : def.features,
    comingSoon: typeof incoming.comingSoon === 'boolean' ? incoming.comingSoon : def.comingSoon,
    embedUrl: incoming.embedUrl ?? def.embedUrl ?? '',
    // channelId only applies to the youtube section (ignored elsewhere).
    channelId: incoming.channelId ?? def.channelId ?? '',
  };
}

export function normalizeMedia(body = {}) {
  return {
    youtube: mergeSection(DEFAULT_MEDIA.youtube, body.youtube),
    spotify: mergeSection(DEFAULT_MEDIA.spotify, body.spotify),
  };
}

export async function getMedia() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return normalizeMedia(JSON.parse(raw));
  } catch {
    return DEFAULT_MEDIA;
  }
}

export async function writeMedia(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
