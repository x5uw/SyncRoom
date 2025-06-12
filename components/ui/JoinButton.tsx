"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";


interface JoinButtonProps {
    roomId: string;
}

export default function JoinButton({ roomId }: JoinButtonProps) {
    const router = useRouter();

    // handle join request for private rooms
    const handleJoin = async () => {
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
            if (entry !== room.password) {
                window.alert("Incorrect password. Please try again.");
                return;
            }
        }
        // redirect to the room page
        router.push(`/room/${roomId}`);
    }


    return (
        <Button onClick={handleJoin}>
            Join
        </Button>
    );
}