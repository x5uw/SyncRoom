/**
 * Author: Manuel Rodriguez
 *
 * File: /app/room/[id]/host-playback/route.js
 * Description:
 * - Loads provider tokens + last_active_at
 * - Expires after 30 min of inactivity
 * - Refreshes host’s access token if needed
 * - Calls Spotify’s currently-playing endpoint
 *
 * Usage:
 *   const res = await fetch(`/room/${roomId}/host-playback`)
 *   const { playback } = await res.json()
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { fetchSpotify } from "@/lib/spotify/fetch.js";

// Spotify’s token refresh endpoint
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

/**
 * Refresh the Spotify access token
 */

async function refreshSpotifyAccessToken(refreshToken) {
    // Build the request body
    const requestBody = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    // Combine client ID and secret, then Base64-encode for Basic auth
    const clientCredentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedCredentials = Buffer.from(clientCredentials).toString("base64"); // Base64 for basic auth

    // Call Spotify’s /api/token endpoint
    const tokenResponse = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/x-www-form-urlencoded", // requirements from spotify
        },
        body: requestBody,
    });

    // If the response isn’t 2xx, throw an error to be caught below
    if (!tokenResponse.ok) {
        const statusText = await tokenResponse.text(); // read as raw text instead of json
        throw new Error(
            `Spotify token refresh failed: ${tokenResponse.status} ${statusText}`
        );
    }

    // Parse JSON and return the new access token
    const tokenJson = await tokenResponse.json();
    return tokenJson.access_token;
}


export async function GET(request, { params }) {
    const { id: roomId } = params;

    // Initialize a Supabase client that reads from the request’s cookies
    const supabase = supabaseServer();

    // Load the host’s provider tokens and last active timestamp from the DB
    const { data: roomRecord, error: databaseError } = await supabase
        .from("rooms")
        .select("provider_token, provider_refresh_token, last_active_at")
        .eq("room_id", roomId)
        .single();

    // If we can’t find the room or there’s a DB error, return 404
    if (databaseError || !roomRecord) {
        console.error("[HOST-PLAYBACK] Database lookup failed:", databaseError);
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if the host’s last activity was more than 30 minutes ago
    const lastActiveDate = new Date(roomRecord.last_active_at);
    const millisecondsSince = Date.now() - lastActiveDate.getTime();
    const thirtyMinutesMs = 30 * 60 * 1000;

    if (millisecondsSince > thirtyMinutesMs) {
        console.warn(
            `[HOST-PLAYBACK] Room expired (>${thirtyMinutesMs}ms):`,
            roomId
        );
        return NextResponse.json(
            { error: "Room expired due to inactivity" },
            { status: 410 }
        );
    }

    // Refresh the access token if it may have expired
    let accessToken = roomRecord.provider_token;
    try {
        accessToken = await refreshSpotifyAccessToken(
            roomRecord.provider_refresh_token
        );
    } catch (tokenError) {
        console.error("[HOST-PLAYBACK] Token refresh error:", tokenError);
        return NextResponse.json(
            { error: "Failed to refresh Spotify token" },
            { status: 502 }
        );
    }

    // Call Spotify’s “currently-playing” API to fetch the host’s playback state
    try {
        const playbackData = await fetchSpotify(
            "me/player/currently-playing",
            "GET",
            accessToken
        );

        // Return exactly what Spotify gave us under `playback`
        return NextResponse.json({ playback: playbackData });
    } catch (playbackError) {
        console.error("[HOST-PLAYBACK] Spotify API error:", playbackError);
        return NextResponse.json(
            { error: playbackError.message },
            { status: 502 }
        );
    }
}
