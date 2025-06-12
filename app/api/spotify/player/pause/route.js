/**
 * author: Manuel Rodriguez
 * 
 * /app/api/spotify/player/pause/route.js
 * 
 * Pauses playback on listeners active Spotify player.
 * 
 * Example client call (inside a React client component):
 *   import { supabaseBrowser } from "@/lib/supabase/browser.js";
 *   const supabase = supabaseBrowser();
 *   const { data:{ session } } = await supabase.auth.getUser();
 *   fetch("/api/spotify/player/pause", {
 *     method: "PUT",
 *     headers: {
 *       "Authorization": `Bearer ${session.provider_token}`
 *     }
 *   });
 * 
 * reference: https://developer.spotify.com/documentation/web-api/reference/pause-a-users-playback
 */

import { NextResponse } from "next/server";                     // Import Next.js response handler
import { fetchSpotify } from "@/lib/spotify/fetch.js";          // Import helper function to call Spotify API
import { getSpotifyToken } from "@/lib/spotify/getToken.js";    // Import function to get Spotify access token from Supabase

export async function PUT(req) {
    // Read the token from the header or Supabase session
    const headerAuth = req.headers.get("authorization");
    const headerToken = headerAuth ? headerAuth.replace("Bearer ", "") : null; 
    const spotifyToken = headerToken || (await getSpotifyToken());

    // If no token, return 401 Unauthorized
    if (!spotifyToken) {
        return NextResponse.json(
            { error: "No Spotify token (user not authenticated)" },
            { status: 401 }
        );
    }
    // Forward the request to Spotify's pause endpoint
    const data = await fetchSpotify("me/player/pause", "PUT", spotifyToken);
    // Return Spotify’s JSON or `{ ok: true }` if Spotify returned 204, 204 response means playback paused successfully
    return NextResponse.json(data ?? { ok: true });
}