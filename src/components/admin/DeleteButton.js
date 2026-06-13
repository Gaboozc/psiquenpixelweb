'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ slug, type }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/admin/${type}/${slug}`, { method: 'DELETE' });
    router.refresh();
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button onClick={handleDelete} disabled={deleting}
          className="text-red-400 hover:text-red-300 text-xs font-body transition-colors disabled:opacity-50">
          {deleting ? '...' : 'Confirmar'}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-brand-muted hover:text-brand-text text-xs font-body transition-colors">
          No
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="text-brand-muted hover:text-red-400 text-xs font-body transition-colors">
      Eliminar
    </button>
  );
}
