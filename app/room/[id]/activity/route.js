/**
 * Author Manuel Rodriguez
 *
 * File: /app/room/[id]/activity/route.js
 * Description:
 *  - Call this endpoint on every meaningful host action
 *    (page load, play/pause click, etc.) to reset the
 *    30-minute inactivity timer.
 *
 * Usage (client-side):
 *   await fetch(`/room/${roomId}/activity`, { method: 'POST' })
 */

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request, { params }) {
    // — Log inside the handler, where params actually exists
    console.log("[ACTIVITY] 🔥 route hit for roomId=", params.id);
    const roomId = params.id;

    const supabase = supabaseServer();

    // — Use getUser() to securely authenticate the user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("[ACTIVITY] auth.getUser error:", userError);
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    // — Verify that this user is actually the host of this room
    const { data: room, error: roomErr } = await supabase
        .from("rooms")
        .select("host_id")
        .eq("room_id", roomId)
        .single();

    if (roomErr || !room) {
        console.error("[ACTIVITY] could not load room:", roomErr);
        return NextResponse.json(
            { error: "Room lookup failed" },
            { status: 500 }
        );
    }
    if (room.host_id !== user.id) {
        console.error(
            "[ACTIVITY] forbidden: user",
            user.id,
            "is not host of room",
            roomId
        );
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // — Update the last_active_at timestamp to now
    const { error: updateErr } = await supabase
        .from("rooms")
        .update({ last_active_at: new Date().toISOString() })
        .eq("room_id", roomId);

    if (updateErr) {
        console.error("[ACTIVITY] failed to update last_active_at:", updateErr);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
