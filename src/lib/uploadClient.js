// Browser-side upload helper. Two steps: ask our API for a signed upload URL
// (it validates type/size), then PUT the file straight to Supabase Storage.
// Resolves to { url, kind } ('image' | 'video'); throws an Error with a
// user-presentable message on failure.
export async function uploadFile(file) {
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error al preparar la subida');

  // Same wire format @supabase/storage-js uses for uploadToSignedUrl.
  const form = new FormData();
  form.append('cacheControl', '3600');
  form.append('', file);
  const put = await fetch(data.signedUrl, { method: 'PUT', body: form });
  if (!put.ok) {
    const detail = await put.text().catch(() => '');
    throw new Error(`No se pudo subir el archivo (${put.status}) ${detail.slice(0, 120)}`.trim());
  }

  return { url: data.url, kind: data.kind };
}
