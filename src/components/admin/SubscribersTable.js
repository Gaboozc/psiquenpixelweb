'use client';

import { useState } from 'react';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function exportCSV(subscribers) {
  const rows = [
    ['Email', 'Suscrito el'],
    ...subscribers.map((s) => [s.email, s.subscribedAt || '']),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `suscriptores-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SubscribersTable({ initialSubscribers }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState(null);

  const filtered = query
    ? subscribers.filter((s) => s.email.toLowerCase().includes(query.toLowerCase()))
    : subscribers;

  const handleDelete = async (email) => {
    setDeleting(email);
    try {
      await fetch(`/api/admin/newsletter/${encodeURIComponent(email)}`, { method: 'DELETE' });
      setSubscribers((prev) => prev.filter((s) => s.email !== email));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por email..."
          className="admin-input w-full sm:w-72"
        />
        <button
          onClick={() => exportCSV(subscribers)}
          disabled={subscribers.length === 0}
          className="shrink-0 border border-brand-border text-brand-muted text-xs px-4 py-2 font-body hover:border-brand-amber hover:text-brand-amber transition-colors disabled:opacity-40"
        >
          ↓ Exportar CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div
          className="pixel-border p-12 text-center"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <p className="text-brand-muted text-sm font-body">
            {query ? 'Sin resultados para esa búsqueda.' : 'No hay suscriptores aún.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal" style={{ fontFamily: 'var(--font-pixel)' }}>
                  EMAIL
                </th>
                <th className="text-left text-brand-muted text-[9px] tracking-widest py-2 pr-4 font-normal hidden sm:table-cell" style={{ fontFamily: 'var(--font-pixel)' }}>
                  SUSCRITO EL
                </th>
                <th className="text-right py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.email} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 text-brand-text">{sub.email}</td>
                  <td className="py-3 pr-4 text-brand-muted hidden sm:table-cell">{formatDate(sub.subscribedAt)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(sub.email)}
                      disabled={deleting === sub.email}
                      className="text-brand-muted hover:text-red-400 text-xs font-body transition-colors disabled:opacity-40"
                    >
                      {deleting === sub.email ? '...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query && (
        <p className="text-brand-muted text-xs font-body">
          {filtered.length} de {subscribers.length} suscriptores
        </p>
      )}
    </div>
  );
}
