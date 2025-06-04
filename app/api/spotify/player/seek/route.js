/**
 * author: Manuel Rodriguez
 * 
 * /app/api/spotify/player/seek/route.js
 * 
 * Moves the playback position in the active Spotify player to be sync’d 
 * with the current room’s playback position.
 * 
 * Body of the request should be a JSON object with a single field:
 *  { position_ms: number }  // Position in milliseconds to seek to
 * 
 * reference: https://developer.spotify.com/documentation/web-api/reference/seek-to-position-in-currently-playing-track
 */

import { NextResponse } from "next/server";                     // Import Next.js response handler
import { fetchSpotify } from "@/lib/spotify/fetch.js";          // Import helper function to call Spotify API
import { getSpotifyToken } from "@/lib/spotify/getToken.js";    // Import function to get Spotify access token from Supabase

export async function PUT(req) {
    // Parse the JSON body to get the position_ms
    const body = await req.json();
    const positionMs = body.position_ms; // Extract position_ms from the request body
    if (typeof positionMs !== "number" || positionMs < 0) {
        return NextResponse.json(
            { error: "Invalid position_ms value" },
            { status: 400 }
        );
    }
    // Read the token from the Authorization header or Supabase session
    const headerAuth = req.headers.get("authorization");
    const headerToken = headerAuth ? headerAuth.replace("Bearer ", "") : null; // Remove "Bearer " prefix
    const spotifyToken = headerToken || (await getSpotifyToken()); // Use the header token or fetch from Supabase

    // Check if we have a Spotify token
    if (!spotifyToken) { 
        return NextResponse.json(
            { error: "No Spotify token (user not authenticated)" },
            { status: 401 }
        );
    }

    // Forward the request to Spotify's seek endpoint
    await fetchSpotify(
        `me/player/seek?position_ms=${positionMs}`,
        "PUT",
        spotifyToken
    );
    
    // Return a success response
    return NextResponse.json({ ok: true });
}