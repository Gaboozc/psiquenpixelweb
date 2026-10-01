-- Psique 'n' Pixel — migración 002: sagas en el blog + campo "Juego" en posts
--
-- Para la base que YA tiene el esquema inicial aplicado.
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query → Run.
-- Es idempotente: se puede volver a ejecutar sin romper nada.

-- ── Sagas: agrupan posts en orden (con una introducción opcional) ───────────
create table if not exists public.sagas (
  slug         text primary key,
  title        text not null,
  description  text not null default '',
  cover_image  text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.sagas enable row level security;

-- Las sagas en sí no contienen nada privado; su visibilidad pública depende de
-- que tengan posts publicados (lo resuelve la aplicación).
drop policy if exists "public read sagas" on public.sagas;
create policy "public read sagas"
  on public.sagas for select using (true);

-- ── Posts: juego analizado + pertenencia a una saga ─────────────────────────
alter table public.posts add column if not exists game       text    not null default '';
alter table public.posts add column if not exists saga_slug  text;
alter table public.posts add column if not exists saga_order integer not null default 0;
alter table public.posts add column if not exists saga_intro boolean not null default false;

-- FK: si se borra una saga, sus posts quedan sueltos (no se borran); si cambia
-- su slug, los posts lo siguen.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_saga_slug_fkey') then
    alter table public.posts
      add constraint posts_saga_slug_fkey foreign key (saga_slug)
      references public.sagas (slug) on update cascade on delete set null;
  end if;
end $$;

create index if not exists posts_saga_idx on public.posts (saga_slug, saga_order);

-- Como mucho UNA introducción por saga.
create unique index if not exists posts_one_intro_per_saga
  on public.posts (saga_slug) where saga_intro;

-- ── Limpieza opcional ───────────────────────────────────────────────────────
-- La antigua sección de análisis del catálogo (tabla "games") ya no se usa: los
-- análisis ahora son posts del blog. Está vacía; si quieres borrarla, descomenta:
-- drop table if exists public.games;
