/**
 * author: Manuel Rodriguez
 * 
 * app/room/[id]/sync/route.js
 * 
 * Called by the DJ/Host to sync the playback state of the room with the active Spotify player.
 * Body should be a JSON object with the following fields:
 *     {  
 *       type: "sync",            // or "room_init" 
 *       track_uri: "spotify:track:...",  
 *       position_ms: 36000,       // ms into the track
 *       paused: false,            // boolean  
 *       ts: 1685751234567         // Date.now() on the host 
 *     }   
 * 
 * Inserts {room_id, paylod } into a room_sync table in Supabase realtime
 * THis is fanned out to all clients in the room via Supabase realtime.
 * Supabase realtime allows us to broadcast the sync state to all clients in the room
 * 
 * Example client call (inside a DJ React component):
 *   import { supabaseBrowser } from "@/shared/lib/supabase/browser.js";
 *   const supabase = supabaseBrowser();
 *   const packet = {
 *     type: "sync",
 *     track_uri: "spotify:track:7ouMYWpwJ422jRcDASZB7P",
 *     position_ms: 45000,
 *     paused: false,
 *     ts: Date.now()
 *   };          
 *   await fetch(`app/room/$[id]/sync`, {
 *     method: "POST",              
 *     headers: { "Content-Type": "application/json" }, 
 *     body: JSON.stringify(packet)   
 *   });   
 * 
 */

import { NextResponse } from "next/server";                     // Import Next.js response handler
import { createClient } from "@supabase/supabase-js";           // Import Supabase client

export async function POST(req, { params }) {
    // Parse the JSON body
    const payload = await req.json();
    // Validate the payload structure
    if (!payload?.type) { // type here is required 
        return NextResponse.json(
            { error: "Invalid payload: 'type' is required" },
            { status: 400 }
        );
    }
    // Create a Supabase client with service role credentials
    // This is necessary to bypass RLS (Row Level Security) for this operation
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert the payload into the room_sync table
    // (columns: room_id, payload)
    const {error} = await supabase
        .from("rooms_sync")
        .insert({
            room_id: params.id, // Use the room ID from the URL parameters
            payload: payload    // Insert the entire payload object
        });

    // Handle any errors during the insert operation 
    if (error) {
        console.error("Sync insert error:", error);
        return NextResponse.json(
            { error: `Failed to insert sync data: ${error.message}` },
            { status: 500 }
        );
    }
    // Return a success response
    return NextResponse.json({ ok: true });
}
