import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'media.json');

export const DEFAULT_MEDIA = {
  youtube: {
    description:
      'Análisis en vídeo, ensayos visuales y debates sobre psicología en los videojuegos. Suscríbete para no perderte ningún episodio.',
    features: [
      { label: 'Análisis en profundidad', desc: 'Disecciones de narrativa y psicología' },
      { label: 'Ensayos visuales', desc: 'Documentales cortos sobre cultura gamer' },
      { label: 'Debates y reseñas', desc: 'Conversaciones sobre los juegos del momento' },
    ],
    comingSoon: true,
    embedUrl: '',
  },
  spotify: {
    description:
      'El podcast de Las Mazmorras de la Mente: conversaciones profundas sobre narrativa, psicología y cultura de los videojuegos.',
    features: [
      { label: 'Episodios de análisis', desc: 'Profundidad sin prisa' },
      { label: 'Entrevistas', desc: 'Desarrolladores, psicólogos y críticos' },
    ],
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
