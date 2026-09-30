import { readContent, writeContent } from './siteContent';

export const DEFAULT_COMUNIDAD = {
  twitch: {
    description: '',
  },
  discord: {
    serverName: '',
    tagline: '',
    description: '',
    footnote: '',
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
  const parsed = await readContent('comunidad');
  return parsed ? normalizeComunidad(parsed) : DEFAULT_COMUNIDAD;
}

export async function writeComunidad(data) {
  await writeContent('comunidad', data);
}
