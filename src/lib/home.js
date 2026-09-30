import { readContent, writeContent } from './siteContent';

export const DEFAULT_HOME = {
  hero: {
    phrases: [],
    ctas: [
      { label: 'LEER POSTS', href: '/blog' },
      { label: 'VER CATÁLOGO', href: '/catalogo' },
    ],
    videoUrl: '/video/hero-bg.mp4',
  },
  mediaBanner: {
    eyebrow: '',
    title: '',
    text: '',
    primaryLabel: 'IR A MEDIA',
    primaryHref: '/media',
    secondaryLabel: '',
  },
  communityBanner: {
    eyebrow: '',
    title: '',
    text: '',
    primaryLabel: 'IR A COMUNIDAD',
    primaryHref: '/comunidad',
    secondaryLabel: '',
  },
};

function mergeBanner(def, incoming = {}) {
  return {
    eyebrow: incoming.eyebrow ?? def.eyebrow,
    title: incoming.title ?? def.title,
    text: incoming.text ?? def.text,
    primaryLabel: incoming.primaryLabel ?? def.primaryLabel,
    primaryHref: incoming.primaryHref ?? def.primaryHref,
    secondaryLabel: incoming.secondaryLabel ?? def.secondaryLabel,
  };
}

export function normalizeHome(body = {}) {
  const hero = body.hero ?? {};
  const phrases = Array.isArray(hero.phrases)
    ? hero.phrases.map((p) => String(p).trim()).filter(Boolean)
    : DEFAULT_HOME.hero.phrases;
  const ctas = Array.isArray(hero.ctas)
    ? hero.ctas
        .map((c) => ({ label: String(c.label ?? '').trim(), href: String(c.href ?? '').trim() }))
        .filter((c) => c.label && c.href)
    : DEFAULT_HOME.hero.ctas;

  return {
    hero: {
      phrases: phrases.length ? phrases : DEFAULT_HOME.hero.phrases,
      ctas: ctas.length ? ctas : DEFAULT_HOME.hero.ctas,
      videoUrl: hero.videoUrl ?? DEFAULT_HOME.hero.videoUrl,
    },
    mediaBanner: mergeBanner(DEFAULT_HOME.mediaBanner, body.mediaBanner),
    communityBanner: mergeBanner(DEFAULT_HOME.communityBanner, body.communityBanner),
  };
}

export async function getHome() {
  const parsed = await readContent('home');
  return parsed ? normalizeHome(parsed) : DEFAULT_HOME;
}

export async function writeHome(data) {
  await writeContent('home', data);
}
