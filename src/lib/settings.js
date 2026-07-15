import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'settings.json');

// Default links — used as a fallback when settings.json is missing, and as the
// seed shape so every consumer can rely on these keys existing.
export const DEFAULT_SETTINGS = {
  social: {
    youtube: 'https://youtube.com/@psiquenpixel',
    discord: 'https://discord.gg/psiquenpixel',
    spotify: 'https://open.spotify.com/show/psiquenpixel',
    instagram: 'https://instagram.com/psiquenpixel',
    twitch: 'https://twitch.tv/psiquenpixel',
  },
  support: {
    kofi: 'https://ko-fi.com/psiquenpixel',
    patreon: 'https://patreon.com/psiquenpixel',
  },
};

// Read site settings from disk, merged over the defaults so missing keys never
// break a consumer. Safe to call from Server Components and route handlers.
export async function getSettings() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      social: { ...DEFAULT_SETTINGS.social, ...(parsed.social ?? {}) },
      support: { ...DEFAULT_SETTINGS.support, ...(parsed.support ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
