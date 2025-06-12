// File: /app/room/[id]/page.tsx

import { supabaseServer } from "@/lib/supabase/server"
import { Database } from "@/lib/types/database.types"   // ← your newly created types
import NavBar from "@/components/NavBar"
import RoomUI from "@/components/RoomUI"

export default async function RoomPage({
  params: { id: roomId },
}: {
  params: { id: string }
}) {
  // ─────────── 1) Initialize Supabase ───────────
  const supabase = supabaseServer()

  // ─────────── 2) Load the current user (for isHost) ───────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ─────────── 3) Fetch the entire room row ───────────
  const { data, error: fetchError } = await supabase
    .from("rooms")
    .select()                       // ← no args = select all columns
    .eq("room_id", roomId)         // or .eq("join_id", roomId)
    .single()

  if (fetchError || !data) {
    return (
      <div className="p-8 text-red-500">
        Room not found.
      </div>
    )
  }

  // ─────────── 4) Cast to your Table Row type ───────────
  const roomRow = data as Database["public"]["Tables"]["rooms"]["Row"]

  // ─────────── 5) Destructure & rename snake_case → camelCase ───────────
  const {
    room_id: id,
    name,
    description,
    host_id: hostId,
    //listener_count: listenerCount = 0,
  } = roomRow

  // ─────────── 6) (Optional) Fetch the host’s username ───────────
  const { data: hostUser } = await supabase
    .from("users")
    .select("username")
    .eq("host_id", hostId!)
    .single()

  // ─────────── 7) Build the object RoomUI expects ───────────
  const roomDetails = {
    id,
    name: name ?? "",
    description: description ?? "",
    host_id: hostId ?? "",
    host_name: hostUser?.username ?? "Host",
    listener_count: 0,
    is_favorited_by_current_user: false,
    is_liked_by_by_current_user: false, 
    stream_url: null,
  }

  // ─────────── 8) Decide if the current user is the host ───────────
  const isHost = user?.id === hostId

  // ─────────── 9) Render NavBar + RoomUI ───────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <RoomUI room={roomDetails} isHost={isHost} />
    </div>
  )
}



/*

import NavBar from "@/components/NavBar";
import RoomUI from "@/components/RoomUI"; // your existing UI component
import { supabaseServer } from "@/lib/supabase/server"

export default async function TestRoomPage() {

    
    const supabase = supabaseServer()
    const {
        data: { session },
    } = await supabase.auth.getUser()
    
    // Hard-coded dummy data matching RoomUI’s prop shape:
    const dummyRoom = {
        id: "test-room",
        name: "Test Room UI",
        description: "This is a dummy room to test RoomUI without a database.",
        host_id: "dummy-host-id",
        host_name: "Test Host",
        listener_count: 42,
        is_favorited_by_current_user: false,
        stream_url: null, // or a real video URL if you want
        is_liked_by_by_current_user: false
        // …any other fields RoomUI expects (e.g. created_at if used)…
    };

    const isHost = session?.user?.id === dummyRoom.host_id

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <RoomUI 
            room={dummyRoom}
            isHost={isHost}
            />
        </div>
    );
}
*/
