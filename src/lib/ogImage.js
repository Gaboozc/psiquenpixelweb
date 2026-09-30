import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// Shared branded OG card: a colored eyebrow, a large title, and the site mark.
// `accent` is a hex color (amber for catálogo, purple for blog).
export function renderOgCard({ eyebrow, title, accent = '#9b59f7' }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d0d0f',
          border: `16px solid ${accent}`,
          color: '#e8e6f0',
          fontFamily: 'sans-serif',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 6, color: accent }}>
          {eyebrow}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 6, color: '#8a8799' }}>
          ⚔ PSIQUE &apos;N&apos; PIXEL — LAS MAZMORRAS DE LA MENTE
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
