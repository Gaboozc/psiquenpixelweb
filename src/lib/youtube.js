// Fetch a YouTube channel's latest uploads via its public RSS feed — no API key.
// Needs the channel ID (starts with "UC..."). The feed URL is:
//   https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxxxxxx
//
// We parse the Atom XML with small regexes (no XML dependency in the project).

const FEED = (channelId) =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

function decodeEntities(s = '') {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pick(block, re) {
  const m = block.match(re);
  return m ? m[1] : '';
}

// Parse the Atom feed into a list of { id, title, url, published, thumbnail }.
export function parseYoutubeFeed(xml, limit = 6) {
  const entries = xml.split('<entry>').slice(1);
  return entries.slice(0, limit).map((block) => {
    const id = pick(block, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = decodeEntities(pick(block, /<title>([^<]*)<\/title>/));
    const published = pick(block, /<published>([^<]+)<\/published>/);
    const thumbnail = pick(block, /<media:thumbnail[^>]*url="([^"]+)"/);
    return {
      id,
      title,
      url: id ? `https://www.youtube.com/watch?v=${id}` : '',
      published,
      thumbnail: thumbnail || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''),
    };
  }).filter((v) => v.id);
}

// Public: latest videos for a channel. Returns [] on any error / missing id.
// Cached for an hour via the fetch cache so we don't hammer YouTube.
export async function getLatestVideos(channelId, limit = 6) {
  if (!channelId) return [];
  try {
    const res = await fetch(FEED(channelId), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseYoutubeFeed(xml, limit);
  } catch {
    return [];
  }
}
