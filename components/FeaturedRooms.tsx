/**
 * Hyobin Yook
 *
 * FeaturedRooms.tsx fetches up to six rooms from Supabase and displays them in a grid.
 * Currently displays a placeholder album cover image for each room
 *
 */

"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Database } from "@/lib/types/supabase";
import JoinButton from "@/components/ui/JoinButton";
import Image from "next/image";

// Static imports of placeholder album cover imgs
import abbaCover from "@/components/images/abba.png";
import bbCover from "@/components/images/bb.png";
import garCover from "@/components/images/gar.png";
import scCover from "@/components/images/sc.png";
import tsCover from "@/components/images/ts.png";
import tswCover from "@/components/images/tsw.png";

const COVERS = [ // One per each room (6 total)
  abbaCover,
  bbCover,
  garCover,
  scCover,
  tsCover,
  tswCover,
];

// Define each room card info to display
interface FeaturedRoom {
  room_id: string;
  name: string;
  description: string | null;
  host_username: string;
}

export default function FeaturedRooms() {
  // state: fetched rooms data
  const [rooms, setRooms] = useState<FeaturedRoom[]>([]);
  // state: loading 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // error messages for debugging purpose
  const [error, setError] = useState<string | null>(null);

  // fetch rooms once
  useEffect(() => {
    async function fetchRooms() {
      setIsLoading(true);
      setError(null);

      const supabase = supabaseBrowser();


      const { data, error: fetchError } = await supabase
        .from("rooms")
        .select(`
          room_id,
          name,
          description,
          host_id,
          users!rooms_host_id_fkey (
            username
          )
        `)
        .limit(6);

      if (fetchError) {
        console.error("Error fetching rooms:", fetchError);
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        // map raw data to our card data
        const parsed: FeaturedRoom[] = data.map((row) => ({
          room_id: row.room_id,
          name: row.name,
          description: row.description,
          // Take the first element of the users[] array:
          host_username: row.users?.[0]?.username ?? "Unknown",
        }));
        setRooms(parsed);
      }

      setIsLoading(false);
    }

    fetchRooms();
  }, []);

  // — Loading state —
  if (isLoading) {
    return <div className="text-center py-8">Loading featured rooms…</div>;
  }

  // — Error state —
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load featured rooms: {error}
      </div>
    );
  }

  // — Empty state —
  if (rooms.length === 0) {
    return <div className="text-center py-8">No featured rooms available.</div>;
  }

  // fetch successful -> render a 3×2 grid of room cards 
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Featured Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, idx) => {
          // Pick a cover based on the index
          const cover = COVERS[idx % COVERS.length];

          return (
            <div
              key={room.room_id}
              className="border rounded-lg p-4 flex flex-col justify-between shadow-sm"
            >
              {/* Album Cover */}
              <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden">
                <Image
                  src={cover}
                  alt={`${room.name} cover`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Room details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Host: <span className="font-medium">{room.host_username}</span>
                </p>
                {room.description && (
                  <p className="text-sm text-gray-500 mb-4">
                    {room.description}
                  </p>
                )}
              </div>

              {/* Join button */}
              <div className="mt-2">
                <JoinButton roomId={room.room_id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}