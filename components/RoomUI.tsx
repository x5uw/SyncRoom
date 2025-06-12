/*
 * Author: Hyobin Yook
 *
 * RoomUI.tsx is an UI component that renders main 'Room' view for listenrs.
 * It consist of a screen, room information panel, and live chat panel.
 *
 * React hooks and event handlers function entirely in the browser ("use client")
 *
 * NOTE: like_count and favorite_count may be added.
 *
 * /components/RoomUI.tsx
 */
"use client";

import Link from "next/link"; // Navigations between pages without full-reload (Dj profile load)
import { useState } from "react"; // React hook (e.g. room favorited state)
import ChatCard from "./ChatCard"; // ChatCard to be rendered on the page
import FavoriteButton from "./ui/FavoriteButton";
import LikeButton from "./ui/LikeButton";
import { Button } from "@/components/ui/button";

interface RoomRow {
    // Room data to be received as a prop
    id: string;
    name: string;
    description: string | null;
    host_id: string;
    host_name: string | null;
    listener_count: number;
    // TODO:
    // like_count: number;
    // favorite_cout: number;
    is_favorited_by_current_user: boolean;
    is_liked_by_by_current_user: boolean;
    stream_url: string | null;
}

interface RoomUIProps {
    room: RoomRow;
    // ADDITION MADE BY MANUEL:
    isHost?: boolean; // Needed for updated supabase db
}

export default function RoomUI({ room, isHost = false }: RoomUIProps) {
    // ADDITION MADE BY MANUEL: isHost is needed for updated supabase db
    // ADDITION MADE BY MANUEL: needed for local syncing
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    function onHeartToggle(newValue: boolean) {
        console.log(`Room ${room.id} favorited=`, newValue);
        // TODO: Maybe callback to inform the backend/database?
        //  await fetch('app/room/${room.id}/favorite'. {POST}, JSON.stringify({favorited:nnewvalue})),});
    }

    function onLikeToggle(newValue: boolean) {
        console.log(`Room ${room.id} liked =`, newValue);
        // TODO: Maybe callback to inform the database
    }

    // ADDITION MADE BY MANUEL: needed for local syncing
    async function handleSyncPlayPause() {
        setIsSyncing(true);
        try {
            // Keep host alive another 30 minutes
            await fetch(`/room/${room.id}/activity`, {
                method: "POST",
            });

            // Ask server to mirror host playback to local player
            const response = await fetch(`/room/${room.id}/sync`, {
                method: "POST",
            });
            const payload = await response.json();

            if (response.ok && payload.success) {
                setIsPlaying(true); // we just started playback
            } else {
                console.error("[ROOM-UI] Sync failed:", payload.error);
                setIsPlaying(false);
            }
        } catch (networkError) {
            console.error("[ROOM-UI] Network error syncing:", networkError);
            setIsPlaying(false);
        } finally {
            setIsSyncing(false);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* ─────────── Main Content (fills remaining height) ─────────── */}
            <div className="flex flex-1 overflow-hidden p-4 space-x-4 bg-gray-900">
                {/* ─────────── Left Pane (2/3 width) ─────────── */}
                <div className="flex flex-col w-2/3 space-y-4">
                    {/* ─────────── “Screen” / Video Embed ─────────── */}
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={
                                room.stream_url ||
                                "https://youtu.be/ouuPSxE1hK4?si=https://youtu.be/XqZsoesa55w?si=7QfVOzcj9sQF7SoK&t=26"
                            }
                            title="Embedded video player"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* ─────────── Room Info Panel ─────────── */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex justify-between items-start">
                        {/* ─── Left side: room name, host name, description ─── */}
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white">
                                {room.name}
                            </h1>
                            <Link
                                href={`/profile/${room.host_id}`}
                                className="block text-lg font-medium text-blue-400 hover:underline"
                            >
                                {room.host_name || "Unknown Host"}
                            </Link>
                            {room.description && (
                                <p className="text-sm italic text-gray-300">
                                    {room.description}
                                </p>
                            )}
                        </div>

                        {/* ─── Right side: listener count + buttons ─── */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-300">
                                {room.listener_count} listeners
                            </span>

                            <FavoriteButton
                                initialFavorited={
                                    room.is_favorited_by_current_user
                                }
                                onToggle={onHeartToggle}
                            />

                            <LikeButton
                                initialLiked={room.is_liked_by_by_current_user}
                                onToggle={onLikeToggle}
                            />
                        </div>
                    </div>

                    {/* ▶▶▶ INSERTION: Play/Pause Sync Button for LISTENERS */}
                    {!isHost && (
                        <Button
                            onClick={handleSyncPlayPause}
                            disabled={isSyncing}
                            className="w-full"
                        >
                            {isSyncing
                                ? "Syncing…"
                                : isPlaying
                                ? "Pause (sync)"
                                : "Play (sync)"}
                        </Button>
                    )}
                    {/* ▶▶▶ INSERTION: Optional Host Pause Button */}
                    {isHost && (
                        <Button
                            onClick={async () => {
                                // If you have /api/spotify/player/pause:
                                await fetch("/api/spotify/player/pause", {
                                    method: "PUT",
                                });
                            }}
                            variant="outline"
                            className="w-full"
                        >
                            Pause Playback
                        </Button>
                    )}
                </div>

                {/* ─────────── Right Pane: ChatCard (1/3 width) ─────────── */}
                <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-auto">
                    <ChatCard />
                </div>
            </div>
        </div>
    );
}
