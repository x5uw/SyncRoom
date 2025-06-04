// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { Database } from "@/lib/types/supabase";

// interface FeaturedRoom {
//   room_id: string;  // the UUID primary key of the room in your DB
//   name: string;
//   description: string;
//   // …maybe join_id, host, etc.
// }

// const featuredRooms: FeaturedRoom[] = [
//   {
//     room_id: "a1b2c3d4-e5f6-…",
//     name: "Indie Vibes",
//     description: "Chill indie hits all night",
//   },
//   {
//     room_id: "f6e5d4c3-b2a1-…",
//     name: "Late Night Loops",
//     description: "Lo-fi beats for late coding sessions",
//   },
// ];

// export default function FeaturedRooms() {
//   const router = useRouter();

//   return (
//     <div className="space-y-4">
//       {featuredRooms.map((room) => (
//         <div key={room.room_id} className="p-4 border rounded">
//           <h3 className="text-lg font-semibold">{room.name}</h3>
//           <p className="text-sm text-muted-foreground">
//             {room.description}
//           </p>
//           <Button
//             onClick={() => {
//               // If you already know room_id, just push directly:
//               router.push(`/room/${room.room_id}`);
//             }}
//             className="mt-2"
//           >
//             Join
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// }

// components/FeaturedRooms.tsx
"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Database } from "@/lib/types/supabase";
import JoinButton from "@/components/ui/JoinButton";

// Define the shape we want for each card
interface FeaturedRoom {
  room_id: string;
  name: string;
  description: string | null;
  host_username: string;
}

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<FeaturedRoom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      setIsLoading(true);
      setError(null);

      const supabase = supabaseBrowser();

      // 1) We select exactly these columns from "rooms":
      //    - room_id (PK)
      //    - name
      //    - description
      //    - host_id (FK → users.user_id)
      //
      // 2) We also ask Supabase to join in `users(username)` so that
      //    row.users.username will contain the host’s username.
      //
      // 3) limit(6) → only fetch up to six rooms.

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

  // — Successful fetch: render a 3×2 grid of room cards —
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Featured Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.room_id}
            className="border rounded-lg p-4 flex flex-col justify-between shadow-sm"
          >
            {/* Placeholder for a cover image (swap out if you have room.cover_url) */}
            <div className="h-32 bg-gray-200 rounded-md mb-3" />

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
        ))}
      </div>
    </div>
  );
}
