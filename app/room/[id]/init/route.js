/**
 * Author: Manuel Rodriguez
 * 
 * File: /app/room/[id]/init/route.js
 *
 * Description:
 * When a room is first created this will do the following:
 *  - Read the logged‐in user’s Spotify access + refresh tokens
 *  - Stamp them into the `rooms` row
 *  - Initialize last_active_at = NOW()
 *
 * Usage (client-side, right after createRoom()):
 *   await fetch(`/room/${roomId}/init`, { method: 'POST' })
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request, { params }) {
    const { id: roomId } = params;

    const supabase = supabaseServer();

    // Fetch current session (with Spotify tokens)
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getUser();
    // If no valid session, error out
    if (sessionError || !session) {
        console.error("[INIT] auth.getUser failed:", sessErr);
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    // Update the room row in database
    //  set host + tokens + timestamp
    const { error: updateError } = await supabase
        .from("rooms")
        .update({
            host_id: session.user.id,
            provider_token: session.provider_token,
            provider_refresh_token: session.provider_refresh_token,
            last_active_at: new Date().toISOString(),
        })
        .eq("room_id", roomId);

    // Error Handling
    if (updateError) {
        console.error("[INIT] failed to update room:", updateError);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
