/**
 * author: Manuel Rodriguez
 * 
 * route.js
 * 
 * PUT /api/spotify/player/play                                                      
 * Forwards a “start or resume playback” call to Spotify for the user 
 * This is useful for starting playback for listeners who have joined a room.                                                    
 *     
 * Body (all fields optional):                                 
 *     { uris?: [ trackUri, ... ], context_uri?: string, position_ms?: number }
 *                                                              
 *   Example client call (inside a React client component):          
 *   import { supabaseBrowser } from "@/lib/supabase/browser.js";  
 *   const supabase = supabaseBrowser();                   
 *   const { data:{ session } } = await supabase.auth.getSession();
 *   fetch("/api/player/play", {   
 *     method: "PUT", 
 *     headers: {  
 *       "Content-Type": "application/json",  
 *       "Authorization": `Bearer ${session.provider_token}` 
 *     },                                                      
 *     body: JSON.stringify({ uris: ["spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"] })
 *   });
 * 
 * reference: https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback                                                                          
 */
import { NextResponse } from "next/server";                     // Import Next.js response handler
import { fetchSpotify } from "@/lib/spotify/fetch.js";          // Import helper function to call Spotify API
import { getSpotifyToken } from "@/lib/spotify/getToken.js";    // Import function to get Spotify access token from Supabase

export async function PUT(req) {
  // Check for an Authorization header; if missing, fallback to Supabase session
  const headerAuth = req.headers.get("authorization");
  const headerToken = headerAuth ? headerAuth.replace("Bearer ", "") : null; // 
  const spotifyToken = headerToken || (await getSpotifyToken()); 
  
  if (!spotifyToken) { // Check if we have a Spotify token
    return NextResponse.json(
      { error: "No Spotify token (user not authenticated)" },
      { status: 401 }
    );
  }

  // Parse optional JSON body (uris, context_uri, position_ms)
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    // If no JSON or invalid JSON, body remains {}
  }

  // Forward to Spotify
  const data = await fetchSpotify("me/player/play", "PUT", spotifyToken, body); // spotify endpoint for playback control
                                                // will be constructed as "https://api.spotify.com/v1/me/player/play"

  // Return Spotify’s JSON or `{ ok: true }` if Spotify returned 204, 204 response means playback started successfully
  return NextResponse.json(data ?? { ok: true });
}
