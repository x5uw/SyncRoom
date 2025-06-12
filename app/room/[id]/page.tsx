// // File: SyncRoom/app/room/test-room/page.tsx

// import NavBar from "@/components/NavBar";
// import RoomUI from "@/components/RoomUI"; //existing UI component

// export default function TestRoomPage() {
//     // Hard-coded dummy data matching RoomUI’s prop shape:
//     const dummyRoom = {
//         id: "test-room",
//         name: "Test Room UI",
//         description: "This is a dummy room to test RoomUI without a database.",
//         host_id: "dummy-host-id",
//         host_name: "Test Host",
//         listener_count: 42,
//         is_favorited_by_current_user: false,
//         stream_url: null, // or a real video URL if you want
//         is_liked_by_by_current_user: false
//         // …any other fields RoomUI expects (e.g. created_at if used)…
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-background">
//             <RoomUI room={dummyRoom} />
//         </div>
//     );
// }



import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import RoomUI, { RoomRow } from "@/components/RoomUI";

interface RoomSelect {
    room_id: string;
    name: string | null;
    description: string | null;
    host_id: string | null;
    users: { username: string }[];   // note: array!
}

export default async function RoomPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from("rooms")
        // Generic on .select keeps TS happy without deep recursion
        .select(`   room_id,
                    name,
                    description,
                    host_id,
                    users!rooms_host_id_fkey(username)`)
        .eq("join_id", params.id)
        .maybeSingle();

    if (error || !data) {
        console.error("Could not load room:", error);
        return notFound();
    }

    // Grab the first related user row (the host)
    const hostName = data.users[0]?.username ?? null;

    const room: RoomRow = {
        id: data.room_id,
        name: data.name ?? "",
        description: data.description,
        host_id: data.host_id ?? "",
        host_name: hostName,
        listener_count: 0,    // wire up later
        is_favorited_by_current_user: false,
        is_liked_by_by_current_user: false,
        stream_url: null, // add & select this column if you need it
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <RoomUI room={room} />
        </div>
    );
}
