'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostEditor } from '@/components/admin/ContentEditor';

export default function EditPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => { setPost(data); setLoading(false); })
      .catch(() => { setError('No se pudo cargar el post'); setLoading(false); });
  }, [slug]);

  const handleSave = async (payload) => {
    const res = await fetch(`/api/admin/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Error al guardar';
    router.push('/admin/posts');
    router.refresh();
    return null;
  };

  if (loading) return <p className="text-brand-muted text-sm font-body">Cargando...</p>;
  if (error) return <p className="text-red-400 text-sm font-body">{error}</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Editar Post</h1>
        <p className="text-brand-muted text-sm font-body">{slug}</p>
      </div>
      <PostEditor initial={post} onSave={handleSave} saveLabel="Guardar Cambios" />
    </div>
  );
}
