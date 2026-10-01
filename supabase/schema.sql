-- Psique 'n' Pixel — esquema completo de Supabase (para un proyecto NUEVO).
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query → Run.
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- Si tu base ya tiene un esquema anterior, aplica en su lugar los archivos de
-- supabase/migrations/ que falten, en orden.

-- ── Sagas: agrupan posts en orden (con una introducción opcional) ───────────
create table if not exists public.sagas (
  slug         text primary key,
  title        text not null,
  description  text not null default '',
  cover_image  text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Posts del blog (incluye los análisis de juegos) ─────────────────────────
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
  game         text not null default '',
  saga_slug    text references public.sagas (slug) on update cascade on delete set null,
  saga_order   integer not null default 0,
  saga_intro   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_saga_idx on public.posts (saga_slug, saga_order);
-- Como mucho UNA introducción por saga.
create unique index if not exists posts_one_intro_per_saga
  on public.posts (saga_slug) where saga_intro;

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
alter table public.sagas        enable row level security;
alter table public.subscribers  enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select using (published = true);

drop policy if exists "public read sagas" on public.sagas;
create policy "public read sagas"
  on public.sagas for select using (true);

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
