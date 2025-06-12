/**
 * Author: Manuel Rodriguez
 * 
 * File: /app/app/room/[id]/sync/route.js
 * Description:
 *   • Verifies listener session + tokens
 *   • Loads host’s playback (with expiry check)
 *   • Refreshes both host & listener tokens
 *   • Issues a play call on the listener’s device at the host’s
 *     current track & position.
 *
 * Usage:
 *   await fetch(`/room/${roomId}/sync`, { method: 'POST' })
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { fetchSpotify } from "@/lib/spotify/fetch.js";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// Refresh Spotify access token using the stored refresh token
async function refreshAccessToken(refreshToken) {
    try {
        const params = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        });
        const creds = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
        const basic = Buffer.from(creds).toString("base64");
        const resp = await fetch(SPOTIFY_TOKEN_URL, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        return json.access_token;
    } catch (err) {
        console.error("[SYNC] refreshAccessToken failed:", err);
        throw err;
    }
}

export async function POST(request, { params }) {
    const { id: roomId } = params;
    const supabase = supabaseServer();

    // Listener’s session + tokens
    const {
        data: { session },
        error: sessErr,
    } = await supabase.auth.getUser();
    if (sessErr || !session) {
        console.error("[SYNC] auth.getUser error:", sessErr);
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    // —Load host’s refresh token + last_active_at
    const { data: room, error: roomErr } = await supabase
        .from("rooms")
        .select("provider_refresh_token, last_active_at")
        .eq("room_id", roomId)
        .single();

    if (roomErr || !room) {
        console.error("[SYNC] room lookup failed:", roomErr);
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Enforce 30-minute expiry
    if (Date.now() - new Date(room.last_active_at).getTime() > 30 * 60 * 1000) {
        console.warn("[SYNC] room expired:", roomId);
        return NextResponse.json({ error: "Room expired" }, { status: 410 });
    }

    // Refresh host & listener access tokens
    let hostAccess, listenerAccess;
    try {
        hostAccess = await refreshAccessToken(room.provider_refresh_token);
        listenerAccess = await refreshAccessToken(
            session.provider_refresh_token
        );
    } catch (err) {
        console.error("[SYNC] token refresh error:", err);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 502 }
        );
    }

    // Fetch host’s currently-playing
    let hostPlayback;
    try {
        hostPlayback = await fetchSpotify(
            "me/player/currently-playing",
            "GET",
            hostAccess
        );
    } catch (err) {
        console.error("[SYNC] fetchSpotify(host) error:", err);
        return NextResponse.json(
            { error: "Failed to fetch host playback" },
            { status: 502 }
        );
    }

    if (!hostPlayback?.is_playing) {
        console.warn("[SYNC] host is not currently playing");
        return NextResponse.json(
            { error: "Host is not playing right now" },
            { status: 409 }
        );
    }

    // Build play body
    const playBody = {
        position_ms: hostPlayback.progress_ms,
        ...(hostPlayback.context?.uri
            ? { context_uri: hostPlayback.context.uri }
            : { uris: [hostPlayback.item.uri] }),
    };

    // Send play command to listener
    try {
        await fetchSpotify("me/player/play", "PUT", listenerAccess, playBody);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[SYNC] fetchSpotify(listener) error:", err);
        return NextResponse.json(
            { error: "Failed to sync playback" },
            { status: 502 }
        );
    }
}
