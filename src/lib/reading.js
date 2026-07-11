// Estimate reading time in minutes from raw markdown (~200 words per minute)
export function readingTime(markdown) {
  if (!markdown) return 1;
  // strip markdown syntax noise for a rough word count
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')    // code blocks
    .replace(/<[^>]+>/g, ' ')           // html/iframes
    .replace(/[#>*_`~\-!\[\]()]/g, ' ') // md punctuation
    .trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

// Slugify heading text for anchor ids (Spanish-friendly)
export function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')    // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Inject unique id attributes into h2/h3 of rendered HTML and return the
// heading list for building a table of contents. Ids stay in sync with the TOC.
export function withHeadingIds(html) {
  if (!html) return { html: '', headings: [] };
  const headings = [];
  const seen = {};

  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugifyHeading(text) || 'seccion';
    if (seen[id]) {
      seen[id] += 1;
      id = `${id}-${seen[id]}`;
    } else {
      seen[id] = 1;
    }
    headings.push({ level: Number(level), text, id });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: out, headings };
}
