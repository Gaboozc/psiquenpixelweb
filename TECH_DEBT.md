# TECH DEBT — Psique 'n' Pixel

Items pendientes de implementar. Ordenados por prioridad aproximada.

---

## Contenido y datos

- [ ] Reemplazar datos hardcodeados en `app/page.js` con datos reales leídos desde los archivos Markdown via `getAllPosts()` y `getAllGames()`
- [ ] Implementar sistema completo de lectura y renderizado MDX con `gray-matter` + `remark` / `rehype`
- [ ] Agregar más artículos de blog en `src/content/blog/`
- [ ] Agregar más análisis en `src/content/catalogo/`

## Integraciones de terceros

- [ ] Implementar Twitch API real en `/api/twitch-status/route.js` y conectar al componente en `comunidad/page.js`
- [ ] Conectar YouTube Data API en `media/page.js` para mostrar últimos vídeos dinámicamente
- [ ] Agregar Spotify embed real con IDs de show/episodio en `media/page.js`
- [ ] Implementar Discord widget en `comunidad/page.js` con `NEXT_PUBLIC_DISCORD_SERVER_ID`
- [ ] Actualizar links de redes sociales reales en `components/layout/Footer.js`

## SEO y metadatos

- [ ] Agregar metadata dinámica por página con `generateMetadata` en blog/[slug] y catalogo/[slug]
- [ ] Configurar `sitemap.xml` automático con `next-sitemap` o la nueva API de Next.js
- [ ] Configurar `robots.txt`
- [ ] Agregar Open Graph images dinámicas por artículo

## Rendimiento y assets

- [ ] Agregar vídeo hero real en `public/video/hero-bg.mp4`
- [ ] Optimizar imágenes con `next/image` cuando haya covers reales
- [ ] Agregar imágenes de portada a los artículos y análisis

## Infraestructura

- [ ] Considerar Sanity CMS si el volumen de contenido crece y se necesita edición sin código
- [ ] Configurar variables de entorno en Vercel para producción
- [ ] Añadir Google Analytics o Plausible para métricas
- [ ] Configurar ESLint pre-commit hook con Husky + lint-staged
