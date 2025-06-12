/**
 * author: Manuel Rodriguez
 * 
 * getToken.js
 * /lib/spotify/getToken.js
 *
 * Retrieves the Spotify access token that Supabase stored when the user logged in.
 * This is *not* the Client Credentials flow—rather, Supabase’s “Spotify” provider
 * saves a `provider_token` in the session. We simply pull that out.
 *
 * Uses `supabaseServer()` so it only works in a server‐side 
 * Returns the `provider_token` string or `null` if there’s no session/token.
 *
 * Usage (in a Route Handler):
 *   import { getSpotifyToken } from '@/lib/spotify/getToken.js';
 *   const token = await getSpotifyToken();
 *   if (!token) {
 *     // 401, no user logged in, or token expired
 *   }
 */

import { supabaseServer } from '@/lib/supabase/server';

export async function getSpotifyToken() { 
    const supabaseClient = supabaseServer();    // Initialize Supabase client for server-side operations
    const { data } = await supabaseClient.auth.getUser(); // Get the current session data from Supabase
    // data.session.provider_token is the Spotify access token stored in Supabase

    return data?.session?.provider_token ?? null; // Return the Spotify access token or null if not found
        // the ? operator checks if data and session exist before accessing provider_token
        // the ?? operator returns null if provider_token is undefined or null
}