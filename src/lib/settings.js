import { readContent, writeContent } from './siteContent';

// Default links — used as a fallback when settings.json is missing, and as the
// seed shape so every consumer can rely on these keys existing.
export const DEFAULT_SETTINGS = {
  social: {
    youtube: '',
    discord: '',
    spotify: '',
    instagram: '',
    twitch: '',
  },
  support: {
    kofi: '',
  },
};

// Read site settings from disk, merged over the defaults so missing keys never
// break a consumer. Safe to call from Server Components and route handlers.
export async function getSettings() {
  const parsed = await readContent('settings');
  if (!parsed) return DEFAULT_SETTINGS;
  return {
    social: { ...DEFAULT_SETTINGS.social, ...(parsed.social ?? {}) },
    support: { ...DEFAULT_SETTINGS.support, ...(parsed.support ?? {}) },
  };
}

export async function writeSettings(data) {
  await writeContent('settings', data);
}
