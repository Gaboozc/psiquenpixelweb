import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// Images / GIFs and short videos for embedding inside posts.
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_IMAGE = 8 * 1024 * 1024;   // 8 MB
const MAX_VIDEO = 50 * 1024 * 1024;  // 50 MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Tipo no permitido. Imágenes: JPG, PNG, WebP, GIF, AVIF. Vídeo: MP4, WebM, OGG.' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const limit = isVideo ? MAX_VIDEO : MAX_IMAGE;
    if (bytes.byteLength > limit) {
      const mb = Math.round(limit / (1024 * 1024));
      return NextResponse.json({ error: `El archivo supera el límite de ${mb} MB` }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split('.').pop().toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await fs.writeFile(path.join(uploadsDir, safeName), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${safeName}`, kind: isVideo ? 'video' : 'image' });
  } catch {
    return NextResponse.json({ error: 'Error procesando el archivo' }, { status: 500 });
  }
}
