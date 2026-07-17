import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'comunidad.json');

export const DEFAULT_COMUNIDAD = {
  twitch: {
    description: 'Sesiones de juego en vivo con análisis psicológico en tiempo real.',
  },
  discord: {
    serverName: "Psique 'n' Pixel",
    tagline: 'Las Mazmorras de la Mente',
    description:
      "Debates, recomendaciones, club de lectura de videojuegos y mucho más. La Guild de Psique 'n' Pixel te espera.",
    footnote: 'Análisis colaborativos · Recomendaciones · Club de juego mensual',
  },
};

export function normalizeComunidad(body = {}) {
  const t = body.twitch ?? {};
  const d = body.discord ?? {};
  return {
    twitch: {
      description: t.description ?? DEFAULT_COMUNIDAD.twitch.description,
    },
    discord: {
      serverName: d.serverName ?? DEFAULT_COMUNIDAD.discord.serverName,
      tagline: d.tagline ?? DEFAULT_COMUNIDAD.discord.tagline,
      description: d.description ?? DEFAULT_COMUNIDAD.discord.description,
      footnote: d.footnote ?? DEFAULT_COMUNIDAD.discord.footnote,
    },
  };
}

export async function getComunidad() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return normalizeComunidad(JSON.parse(raw));
  } catch {
    return DEFAULT_COMUNIDAD;
  }
}

export async function writeComunidad(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
