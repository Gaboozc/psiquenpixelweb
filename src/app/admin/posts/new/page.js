'use client';

import { useRouter } from 'next/navigation';
import { PostEditor } from '@/components/admin/ContentEditor';

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = async (payload) => {
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Error al guardar';
    router.push('/admin/posts');
    router.refresh();
    return null;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Nuevo Post</h1>
        <p className="text-brand-muted text-sm font-body">Crea un nuevo artículo de blog</p>
      </div>
      <PostEditor onSave={handleSave} saveLabel="Publicar Post" />
    </div>
  );
}
