// File: components/RoomUI.tsx
"use client";

import Link from "next/link";
import { HeartIcon, Heart as HeartIconSolid } from "lucide-react";
import { useState } from "react";
import ChatCard from "./ChatCard";

interface RoomRow {
    id: string;
    name: string;
    description: string | null;
    host_id: string;
    host_name: string | null;
    listener_count: number;
    is_favorited_by_current_user: boolean;
    stream_url: string | null;
}

interface RoomUIProps {
    room: RoomRow;
}

export default function RoomUI({ room }: RoomUIProps) {
    const [favorited, setFavorited] = useState(room.is_favorited_by_current_user);
    const [volume, setVolume] = useState(50);

    function toggleFavorite() {
        setFavorited((prev) => !prev);
    }

    function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVolume(Number(e.target.value));
    }

    return (
        <div className="flex flex-1">
            {/* ───────── Left Pane (2/3 width) ───────── */}
            <div className="w-2/3 flex flex-col bg-gray-50">
                {/* Live Video Section */}
                <div className="w-full bg-black flex items-center justify-center py-6">
                    <div className="w-full max-w-lg aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={room.stream_url || "https://youtu.be/ouuPSxE1hK4?si=https://youtu.be/XqZsoesa55w?si=7QfVOzcj9sQF7SoK&t=26"}
                            title="Embedded video player"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Room Info Panel */}
                <div className="w-full border-t border-gray-200 bg-white p-4 flex justify-between items-start">
                    <div>
                        <Link
                            href={`/profile/${room.host_id}`}
                            className="text-lg font-semibold text-primary hover:underline"
                        >
                            {room.host_name || "Unknown Host"}
                        </Link>
                        <div className="mt-1">
                            <h2 className="text-2xl font-bold">{room.name}</h2>
                            {room.description && (
                                <p className="mt-1 text-gray-600">{room.description}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                {room.listener_count} listeners
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Volume Slider */}
                        <label className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Vol</span>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="h-2 w-28 accent-primary"
                            />
                        </label>

                        {/* Favorite Toggle */}
                        <button
                            onClick={toggleFavorite}
                            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
                            aria-label={favorited ? "Unfavorite" : "Favorite"}
                        >
                            {favorited ? (
                                <HeartIconSolid className="h-6 w-6 text-red-500" />
                            ) : (
                                <HeartIcon className="h-6 w-6 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ───────── Right Pane (1/3 width) ───────── */}
            <div className="w-1/3 flex items-start justify-center p-6">
                {/* Import the ChatCard component here */}
                <ChatCard />
            </div>
        </div>
    );
}
