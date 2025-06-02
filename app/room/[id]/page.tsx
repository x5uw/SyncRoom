// File: app/room/[id]/page.tsx

import NavBar from "@/components/NavBar";
import RoomUI from "@/components/RoomUI"; // your existing UI component

export default function TestRoomPage() {
    // Hard-coded dummy data matching RoomUI’s prop shape:
    const dummyRoom = {
        id: "test-room",
        name: "Test Room UI",
        description: "This is a dummy room to test RoomUI without a database.",
        host_id: "dummy-host-id",
        host_name: "Test Host",
        listener_count: 42,
        is_favorited_by_current_user: false,
        is_liked_by_by_current_user: false, // Added missing property
        stream_url: null, // or a real video URL if you want
        // …any other fields RoomUI expects (e.g. created_at if used)…
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <RoomUI room={dummyRoom} />
        </div>
    );
}
