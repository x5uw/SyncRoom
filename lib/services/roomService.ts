// File: lib/services/roomService.ts

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Database } from "@/lib/types/supabase";

// Valid characters for a 6-char join_id
const JOIN_ID_CHARS =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const JOIN_ID_LENGTH = 6;

/** 
 * Generate a random 6-character alphanumeric string to use as join_id.
 */
function generateJoinId(): string {
    let result = "";
    const chars = JOIN_ID_CHARS;
    for (let i = 0; i < JOIN_ID_LENGTH; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        result += chars[idx];
    }
    return result;
}


interface NewRoomParams {
    name: string;
    description?: string;
    is_public: boolean;  // default: false = "public", !is_public: "private"
    password?: string;
}

/**
 * Inserts a new room into the "rooms" table and returns the generated UUID.
 *
 * @param params.name         – the room’s name (required)
 * @param params.description  – optional short description
 * @param params.is_public    – "public" or "private" (required)
 * @param params.password     – only used if is_public === "private"
 *
 * @returns The newly‐generated room ID (UUID) as a string.
 * @throws  An Error if Supabase returns an error (other than a join_id collision),
 *          or if it fails to generate a unique join_id after several attempts.
 */
export async function createRoom({
    name,
    description = "",
    is_public,
    password = "",
}: NewRoomParams): Promise<string> {
    const supabase = supabaseBrowser();

    // In case of join_id collision, try up to 5 times
    const MAX_ATTEMPTS = 5;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
        attempt++;

        // Generate a random 6-character join_id
        const joinId = generateJoinId();

        // payload to insert to the table
        const payload: Database["public"]["Tables"]["rooms"]["Insert"] = {
            name,
            description,
            is_public,
            join_id: joinId,
            // Conditionally spread password field:
            ...(is_public === true ? { password } : {}),
        };

        // Try inserting into "rooms". Return only room_id on success
        const { data, error } = await supabase
            .from("rooms")
            .insert([payload])         // ← Note the array here
            .select("room_id")         // ← Only return the generated room_id
            .single();                 // ← Expect exactly one row back


        if (error) {
            // If this was a UNIQUE constraint failure on join_id, try again
            // PostgreSQL unique-violation error code is usually "23505".
            if (
                error.code === "23505" &&
                error.message.includes("duplicate key value") &&
                error.message.includes("join_id")
            ) {
                // Collision—try the next iteration with a fresh join_id
                continue;
            }

            // Some other error (e.g. payload invalid). Propagate it.
            throw new Error(error.message);
        }

        // 4) If we got here, insertion succeeded. Return the new room_id.
        return data.room_id;
    }

    // If we exit the loop, it means we couldn’t find a unique join_id
    throw new Error(
        `Could not generate a unique join_id after ${MAX_ATTEMPTS} attempts. Please try again.`
    );
}

/**
 * Given a 6-character join_id, look up the corresponding room_id.
 * If found, return room_id. If not, throw an Error.
 */
export async function getRoomIdByJoinId(joinId: string): Promise<string> {
    const supabase = supabaseBrowser();

    // Query the 'rooms' table where join_id = provided joinId
    const { data, error } = await supabase
        .from("rooms")
        .select("room_id")
        .eq("join_id", joinId)
        .single();

    if (error) {
        // If no row is found, Supabase still returns error.code = "PGRST116",
        // or data = null. We treat "not found" as a user‐facing error.
        throw new Error(
            error.code === "PGRST116"
                ? "No room with that code."
                : error.message
        );
    }

    // data.room_id is the UUID of the matching room
    return data.room_id;
}