import { NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'http://localhost:7880';

export async function GET() {
  const rooms = ['english-room', 'french-room', 'german-room'];
  const counts: Record<string, number> = {};

  try {
    const client = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    console.log('Fetching room counts from LiveKit...');
    for (const roomName of rooms) {
      try {
        const participants = await client.listParticipants(roomName);
        counts[roomName] = participants.length;
      } catch {
        counts[roomName] = 0;
      }
    }
  } catch (error) {
    console.error('Failed to get room counts:', error);
    for (const roomName of rooms) {
      counts[roomName] = 0;
    }
  }

  return NextResponse.json({ counts }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}