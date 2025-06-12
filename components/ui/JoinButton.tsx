"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useState, useCallback } from "react";


interface JoinButtonProps {
    roomId: string;
}

export default function JoinButton({ roomId }: JoinButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

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

            if (error || !room) {
                console.error("Error fetching room data:", error);
                return;
            }
            if (!room.is_public) {
                const entry = window.prompt("This room is private. Please enter the password to join:");

                if (entry === null) {
                    return;
                }

                if (entry !== room.password) {
                    window.alert("Incorrect password. Please try again.");
                    return;
                }
            }
            // redirect to the room page
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