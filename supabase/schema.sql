-- Psique 'n' Pixel — esquema inicial de Supabase (fase 1: contenido + storage)
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query → Run.
-- Es idempotente: se puede volver a ejecutar sin romper nada.

-- ── Posts del blog ──────────────────────────────────────────────────────────
create table if not exists public.posts (
  slug         text primary key,
  title        text not null,
  date         date not null default current_date,
  category     text not null default '',
  excerpt      text not null default '',
  cover_image  text not null default '',
  tags         text[] not null default '{}',
  content      text not null default '',
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Análisis del catálogo ───────────────────────────────────────────────────
create table if not exists public.games (
  slug         text primary key,
  game         text not null,
  title        text not null,
  date         date not null default current_date,
  genre        text[] not null default '{}',
  excerpt      text not null default '',
  cover_image  text not null default '',
  tags         text[] not null default '{}',
  content      text not null default '',
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Suscriptores de la newsletter ───────────────────────────────────────────
create table if not exists public.subscribers (
  email          text primary key,
  subscribed_at  timestamptz not null default now()
);

-- ── Contenido editable del sitio (clave → JSON) ─────────────────────────────
-- Claves usadas: settings, media, comunidad, home, mazmorra, merch
create table if not exists public.site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- El sitio público solo puede LEER lo publicado. Todas las escrituras (y la
-- tabla de suscriptores) van por el servidor con la service_role, que se salta
-- RLS. Sin políticas de escritura = nadie puede escribir desde el navegador.
alter table public.posts        enable row level security;
alter table public.games        enable row level security;
alter table public.subscribers  enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select using (published = true);

drop policy if exists "public read published games" on public.games;
create policy "public read published games"
  on public.games for select using (published = true);

drop policy if exists "public read site content" on public.site_content;
create policy "public read site content"
  on public.site_content for select using (true);

-- subscribers: sin políticas → inaccesible desde el navegador (solo service_role).

-- ── Storage: bucket público para imágenes / GIFs / vídeos ───────────────────
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "public read uploads" on storage.objects;
create policy "public read uploads"
  on storage.objects for select using (bucket_id = 'uploads');

-- ── Semilla mínima ──────────────────────────────────────────────────────────
insert into public.site_content (key, value) values
  ('settings', '{"social":{"youtube":"","discord":"","spotify":"","instagram":"","twitch":""},"support":{"kofi":"https://ko-fi.com/psiquenpixel"}}'::jsonb)
on conflict (key) do nothing;
