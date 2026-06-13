'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Contraseña incorrecta');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] dungeon-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <p
            className="text-brand-purple text-[9px] tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ⚔ PSIQUE &apos;N&apos; PIXEL ⚔
          </p>
          <h1
            className="text-brand-text text-sm"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            Admin Vault
          </h1>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="pixel-border-purple p-8 flex flex-col gap-5"
          style={{ backgroundImage: 'url(/cards.png?v=2)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div>
            <label
              htmlFor="password"
              className="block text-brand-muted text-[8px] tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              CONTRASEÑA
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="admin-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-[9px] font-body text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-purple text-white text-[9px] tracking-widest px-6 py-3 hover:bg-brand-purple-dim transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-pixel)', boxShadow: '4px 4px 0 #6b3bbf' }}
          >
            {loading ? '...' : 'ENTRAR AL VAULT'}
          </button>
        </form>

        <p className="text-center text-brand-border text-[8px] mt-4 font-body">
          Define ADMIN_PASSWORD en .env.local
        </p>
      </div>
    </div>
  );
}
