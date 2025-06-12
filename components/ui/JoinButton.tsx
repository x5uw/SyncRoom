"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";   // Supabase client configured for browser
import { useRouter } from "next/navigation";            //client side nav



interface JoinButtonProps {
    roomId: string;     /// ID of the room to join
}

export default function JoinButton({ roomId }: JoinButtonProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false) // Tracks whether join action is in progress

    // handle join request for private rooms
    const handleJoin = useCallback(async () => {
        setIsLoading(true);
        try {
            const supabase = supabaseBrowser();

            // load room data
            const { data: room, error } = await supabase
                .from("rooms")
                .select("is_public, password")
                .eq("room_id", roomId)
                .single();

            // If there’s an error or no room, log it and stop
            if (error || !room) {
                console.error("Error fetching room data:", error);
                return;
            }
            // If the room is private, prompt the user for the password
            if (!room.is_public) {
                const entry = window.prompt("This room is private. Please enter the password to join:");
                // If the user cancels the prompt, exit early
                if (entry === null) {
                    return;
                }
                // If the entered password doesn’t match, show an alert and exit
                if (entry !== room.password) {
                    window.alert("Incorrect password. Please try again.");
                    return;
                }
            }
            // If room is public or password correct, navigate to the room page
            router.push(`/room/${roomId}`);
        } catch (error) {
            console.error("[JoinButton]", error);
            window.alert("An error occurred while trying to join the room. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [roomId, router]);

    return (
        <Button onClick={handleJoin}>
            Join
        </Button>
    );

}