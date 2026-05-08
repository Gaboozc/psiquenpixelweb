// Twitch API helper — requires TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET,
// and TWITCH_CHANNEL_NAME in .env.local

const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const STREAMS_URL = 'https://api.twitch.tv/helix/streams';

// Fetch an app access token (Client Credentials flow)
const getAccessToken = async () => {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type:    'client_credentials',
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error('Failed to fetch Twitch access token');
  const { access_token } = await res.json();
  return access_token;
};

// Returns { isLive, title, viewerCount, thumbnailUrl }
export const getTwitchStreamStatus = async () => {
  const { TWITCH_CLIENT_ID, TWITCH_CHANNEL_NAME } = process.env;

  if (!TWITCH_CLIENT_ID || !TWITCH_CHANNEL_NAME) {
    return { isLive: false };
  }

  const token = await getAccessToken();

  const res = await fetch(
    `${STREAMS_URL}?user_login=${TWITCH_CHANNEL_NAME}`,
    {
      headers: {
        'Client-ID':     TWITCH_CLIENT_ID,
        Authorization:   `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch Twitch stream');

  const { data } = await res.json();
  const stream   = data[0];

  if (!stream) return { isLive: false };

  return {
    isLive:       true,
    title:        stream.title,
    viewerCount:  stream.viewer_count,
    thumbnailUrl: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
  };
};
