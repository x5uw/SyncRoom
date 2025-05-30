"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type Room = {
  id: string;
  name: string;
  host: string;
  currentTrack: string;
  listenerCount: number;
};

const featuredRooms: Room[] = [
  {
    id: "room1",
    name: "Indie Vibes",
    host: "Host 1",
    currentTrack: "Track1",
    listenerCount: 49,
  },
  {
    id: "room2",
    name: "Chill Hits",
    host: "Host 2",
    currentTrack: "Track2",
    listenerCount: 62,
  },
  {
    id: "room3",
    name: "Synthwave Room",
    host: "Host 3",
    currentTrack: "Track3",
    listenerCount: 63,
  },
  {
    id: "room4",
    name: "Jazz & Rain",
    host: "Host 4",
    currentTrack: "Track4",
    listenerCount: 25,
  },
  {
    id: "room5",
    name: "Afrobeats Central",
    host: "Host 5",
    currentTrack: "Track5",
    listenerCount: 40,
  },
  {
    id: "room6",
    name: "EDM",
    host: "Host 6",
    currentTrack: "Track6",
    listenerCount: 51,
  },
];

export default function FeaturedRooms() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Featured Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredRooms.map((room) => (
          <div
            key={room.id}
            className="border p-4 rounded-md shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-medium">{room.name}</h3>
              <p className="text-sm text-muted-foreground">Host: {room.host}</p>
              <p className="text-sm mt-1">🎵 {room.currentTrack}</p>
              <p className="text-sm mt-1">{room.listenerCount} listeners</p>
            </div>
            <div className="mt-4">
              <Link href={`/room/${room.id}`}>
                <Button variant="default" className="w-full">
                  Join
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
