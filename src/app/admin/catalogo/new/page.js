'use client';

import { useRouter } from 'next/navigation';
import { GameEditor } from '@/components/admin/ContentEditor';

export default function NewGamePage() {
  const router = useRouter();

  const handleSave = async (payload) => {
    const res = await fetch('/api/admin/catalogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Error al guardar';
    router.push('/admin/catalogo');
    router.refresh();
    return null;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-brand-text text-lg font-body font-bold">Nuevo Análisis</h1>
        <p className="text-brand-muted text-sm font-body">Añade un nuevo juego al catálogo</p>
      </div>
      <GameEditor onSave={handleSave} saveLabel="Publicar Análisis" />
    </div>
  );
}
