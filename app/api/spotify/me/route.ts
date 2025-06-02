/**
 * app/api/spotify/me/route.ts
 *
 *  Fetch the current user’s Spotify profile.
 *  Useful for:
 *    • showing the avatar / display name in the UI
 *    • verifying the account’s subscription plan (premium/free)
 *
 *  Front-end example:
 *
 *    const res = await fetch('/api/spotify/me');
 *    const me  = await res.json();       // standard Spotify “User Object”
 *
 *  Author: Manuel Rodriguez
 */

/*
import { NextResponse } from 'next/server';                         // Import NextResponse for handling responses
import { getSupabase, getValidSpotifyToken } from '@/lib/spotify';  // Import helper functions to interact with Supabase and Spotify

export async function GET() {
  const supabase = getSupabase();
  const token    = await getValidSpotifyToken(supabase);

  // Ensure the user actually linked Spotify
  if (!token) {
    return NextResponse.json({ error: 'Spotify not linked' }, { status: 401 });
  }

  // 2. Pass through to Spotify‘s Web API 
  const resp = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 3. Mirror Spotify’s HTTP status for transparency 
  const json = await resp.json();
  return NextResponse.json(json, { status: resp.status });
}
*/