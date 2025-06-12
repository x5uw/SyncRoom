/** Hyobin Yook */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { getRoomIdByJoinId } from "@/lib/services/roomService";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JoinByCodePanel() {
    const router = useRouter();

    const [joinCode, setJoinCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);

    const handleJoinByCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);

        if (!joinCode.trim()) {
            setJoinError("Please enter a code.");
            return;
        }

        setIsJoining(true);
        try {
            // Resolve the joinCode -> roomId
            const roomId = await getRoomIdByJoinId(joinCode.trim());

            // fetch info
            const { data: room, error } = await supabaseBrowser()
                .from("rooms")
                .select("is_public, password")
                .eq("room_id", roomId)
                .single();

            if (error || !room) {
                throw new Error("Room not found");
            }

            // if private, prompt for password
            if (!room.is_public) {
                const entry = window.prompt(
                    "This room is private. Please enter the password to join:"
                );
                if (entry === null) {
                    // user cancelled
                    setIsJoining(false);
                    return;
                }
                if (entry !== room.password) {
                    window.alert("Incorrect password. Please try again.");
                    setIsJoining(false);
                    return;
                }
            }

            // redirect to the room page
            router.push(`/room/${roomId}`);
        } catch (err: any) {
            setJoinError(err.message || "Could not join room.");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Join a room</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                    Already have a room code? Paste it below.
                </p>
                <form onSubmit={handleJoinByCode} className="space-y-2">
                    <Input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter Room ID"
                        disabled={isJoining}
                    />
                    <Button type="submit" className="w-full" disabled={isJoining}>
                        {isJoining ? "Joining…" : "Join Room"}
                    </Button>
                </form>
                {joinError && (
                    <p className="text-sm text-red-500 mt-2">{joinError}</p>
                )}
            </CardContent>
        </Card>
    );
}
