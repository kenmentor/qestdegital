import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'http://localhost:7880';

const DEFAULT_ROOMS = ['english-room', 'french-room', 'german-room'];

export async function GET(request: NextRequest) {
  const prefix = request.nextUrl.searchParams.get('prefix') || '';

  let rooms = [...DEFAULT_ROOMS];
  if (prefix) {
    rooms = rooms.map(r => `${r}-${prefix}`);
  }

  const counts: Record<string, number> = {};

  try {
    const client = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
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