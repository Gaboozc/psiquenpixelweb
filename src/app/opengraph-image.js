import { ImageResponse } from 'next/og';

export const alt = "Psique 'n' Pixel — Las Mazmorras de la Mente";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0f',
          border: '16px solid #2a2535',
          color: '#e8e6f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 8, color: '#9b59f7' }}>⚔ PSIQUE &apos;N&apos; PIXEL ⚔</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, textAlign: 'center', padding: '0 80px' }}>
          Las Mazmorras de la Mente
        </div>
        <div style={{ fontSize: 30, color: '#8a8799', marginTop: 28, textAlign: 'center', padding: '0 120px' }}>
          Análisis psicológico, narrativo y cultural de videojuegos
        </div>
      </div>
    ),
    { ...size },
  );
}
