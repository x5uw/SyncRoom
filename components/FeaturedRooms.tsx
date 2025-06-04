"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FeaturedRoom {
  room_id: string;  // the UUID primary key of the room in your DB
  name: string;
  description: string;
  // …maybe join_id, host, etc.
}

const featuredRooms: FeaturedRoom[] = [
  {
    room_id: "a1b2c3d4-e5f6-…",
    name: "Indie Vibes",
    description: "Chill indie hits all night",
  },
  {
    room_id: "f6e5d4c3-b2a1-…",
    name: "Late Night Loops",
    description: "Lo-fi beats for late coding sessions",
  },
];

export default function FeaturedRooms() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {featuredRooms.map((room) => (
        <div key={room.room_id} className="p-4 border rounded">
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <p className="text-sm text-muted-foreground">
            {room.description}
          </p>
          <Button
            onClick={() => {
              // If you already know room_id, just push directly:
              router.push(`/room/${room.room_id}`);
            }}
            className="mt-2"
          >
            Join
          </Button>
        </div>
      ))}
    </div>
  );
}