import { getTwitchStreamStatus } from '@/lib/twitch';

export async function GET() {
  try {
    const status = await getTwitchStreamStatus();
    return Response.json(status);
  } catch (error) {
    return Response.json(
      { isLive: false, error: 'Failed to fetch Twitch status' },
      { status: 500 }
    );
  }
}
