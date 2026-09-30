import { NextResponse } from 'next/server';
import { getSupabase, UPLOADS_BUCKET } from '@/lib/supabase';

export const runtime = 'nodejs';

// Images / GIFs and short videos for embedding inside posts.
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_IMAGE = 8 * 1024 * 1024;   // 8 MB
const MAX_VIDEO = 50 * 1024 * 1024;  // 50 MB (Supabase free-plan per-file cap)

// Step 1 of 2. The browser sends file metadata ({ name, type, size }); we
// validate it and hand back a signed upload URL so the file goes straight to
// Supabase Storage (serverless functions can't take bodies over ~4.5 MB).
export async function POST(request) {
  try {
    const { name, type, size } = await request.json();

    const isImage = IMAGE_TYPES.includes(type);
    const isVideo = VIDEO_TYPES.includes(type);
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Tipo no permitido. Imágenes: JPG, PNG, WebP, GIF, AVIF. Vídeo: MP4, WebM, OGG.' },
        { status: 400 },
      );
    }

    const limit = isVideo ? MAX_VIDEO : MAX_IMAGE;
    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Archivo vacío o tamaño inválido' }, { status: 400 });
    }
    if (size > limit) {
      const mb = Math.round(limit / (1024 * 1024));
      return NextResponse.json({ error: `El archivo supera el límite de ${mb} MB` }, { status: 400 });
    }

    const ext = String(name ?? '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || (isVideo ? 'mp4' : 'png');
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const storage = getSupabase().storage.from(UPLOADS_BUCKET);
    const { data, error } = await storage.createSignedUploadUrl(path);
    if (error) throw error;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      url: storage.getPublicUrl(path).data.publicUrl,
      kind: isVideo ? 'video' : 'image',
    });
  } catch (e) {
    console.error('[upload] failed:', e?.message ?? e);
    return NextResponse.json({ error: e?.message || 'Error preparando la subida' }, { status: 500 });
  }
}
