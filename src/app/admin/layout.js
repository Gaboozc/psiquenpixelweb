'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_BASE, ap } from '@/lib/adminPath';

const NAV_ITEMS = [
  { href: ap(),           label: 'Dashboard',        icon: '⊞', exact: true },
  { href: ap('/posts'),   label: 'Posts',             icon: '✦' },
  { href: ap('/catalogo'),label: 'Catálogo',          icon: '⚔' },
  { href: ap('/mazmorra'),label: 'Mazmorra Semana',   icon: '★' },
];

function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push(ap('/login'));
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 bg-brand-surface border-r border-brand-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 border-b border-brand-border">
        <Link href="/" className="block mb-1" title="Ver sitio">
          <p className="text-brand-purple text-[9px] tracking-widest" style={{ fontFamily: 'var(--font-pixel)' }}>
            ⚔ ADMIN VAULT
          </p>
        </Link>
        <p className="text-brand-muted text-[8px] font-body">Psique &apos;n&apos; Pixel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-body transition-colors ${
              isActive(item)
                ? 'bg-brand-purple/20 text-brand-purple border-l-2 border-brand-purple'
                : 'text-brand-muted hover:text-brand-text hover:bg-white/5'
            }`}
          >
            <span className="text-sm w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer links */}
      <div className="p-3 border-t border-brand-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs font-body text-brand-muted hover:text-brand-text transition-colors"
        >
          <span>↗</span> Ver sitio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body text-brand-muted hover:text-red-400 transition-colors text-left"
        >
          <span>✕</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-brand-bg flex overflow-hidden admin-panel">
      {/* Sidebar — desktop always visible */}
      <div className="hidden md:flex h-full">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden absolute inset-0 z-50 flex">
          <div className="w-64 h-full overflow-y-auto">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 border-b border-brand-border flex items-center px-4 gap-4 shrink-0 bg-brand-surface">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-brand-muted hover:text-brand-text p-1"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <p className="text-brand-muted text-xs font-body">
            Panel de Administración
          </p>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
