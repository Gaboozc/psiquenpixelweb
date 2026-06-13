'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GameEditor } from '@/components/admin/ContentEditor';

export default function EditGamePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/catalogo/${slug}`)
      .then((r) => r.json())
      .then((data) => { setGame(data); setLoading(false); })
      .catch(() => { setError('No se pudo cargar el análisis'); setLoading(false); });
  }, [slug]);

  const handleSave = async (payload) => {
    const res = await fetch(`/api/admin/catalogo/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Error al guardar';
    router.push('/admin/catalogo');
    router.refresh();
    return null;
  };

  if (loading) return <p className="text-brand-muted text-sm font-body">Cargando...</p>;
  if (error) return <p className="text-red-400 text-sm font-body">{error}</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Editar Análisis</h1>
        <p className="text-brand-muted text-sm font-body">{game?.game} — {slug}</p>
      </div>
      <GameEditor initial={game} onSave={handleSave} saveLabel="Guardar Cambios" />
    </div>
  );
}
