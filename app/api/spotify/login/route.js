/**
 * app/api/spotify/login/route.js
 *
 * Spotify Authentication “login” API Route (using Next.js App Router).
 *
 * – This file runs entirely on the server.
 * – When the browser navigates to `/api/spotify/login`, this handler
 *   will call `supabase.auth.signInWithOAuth({ provider: 'spotify' })`.
 * – Supabase builds the Spotify authorization URL (including client ID,
 *   scopes, and redirect URI). We then immediately redirect the browser
 *   to that URL (status 302).  
 *
 * – The user logs in on Spotify, then Spotify calls Supabase’s callback:
 *     https://<your-project>.supabase.co/auth/v1/callback?code=…
 *   Supabase exchanges the `code` for access/refresh tokens and sets
 *   a session cookie on the user’s browser. Then Supabase redirects the
 *   browser to whatever you set as `redirectTo` below (e.g. `/auth/callback`).
 *
 * Usage in a React component (Client-side):
 *
 *   function LoginButton() {
 *     return (
 *       <button onClick={() => (window.location.href = '/api/spotify/login')}>
 *         Login with Spotify
 *       </button>
 *     );
 *   }
 * 
 * Author: Manuel Rodriguez
 */
export const dynamic = "force-dynamic";   // ← Skip static optimization
export const runtime = "edge";            // or "nodejs"

import { NextResponse } from 'next/server';             // Importing NextResponse to handle server responses
import { supabaseServer } from '@/lib/supabase/server'; // Importing Supabase server-side client

export async function GET() {
    // Create a Supabase client instance for client-side operations
    const supabase = await supabaseServer();

    // Function to handle login with Spotify
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: { 
            scopes: [       // Scopes define the access level of the application
                            // read here: https://developer.spotify.com/documentation/web-api/concepts/scopes
                'user-read-private',                // Read user's private data
                'user-read-email',                  // Read user's email address
                'streaming',                        // Access to control playback of Spotify clients
                'user-read-playback-state',         // Read access to user's playback state
                'user-modify-playback-state',       // Write access to modify user's playback state
                'playlist-read-private',            // Read access to user's private playlists
                'playlist-read-collaborative',      // Read access to collaborative playlists
            ].join(' '), // Join scopes with a space, spotify requires scopes to be space-separated strings
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // Redirect URI after authentication
        },
    })
    
    // If something went wrong, send the user to an error page:
    if (error) {
        const msg = encodeURIComponent(error.message);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/error?msg=${msg}`,302); // Redirect to error page with error message, 302 status
    }

    // Rediredct the user to the URL provided by Spotify
    return NextResponse.redirect(data.url, 302);
}
