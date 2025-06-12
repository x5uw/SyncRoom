"use client";

import JoinButton from "./ui/JoinButton";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Room {
    id: string;
    name: string;
    createdBy: string;
    image: string;
}

// Hardcoded right now
// TODO: fetch this list from props
const yourRooms: Room[] = [
    {
        id: "indie-vibes",
        name: "Indie Vibes",
        createdBy: "Kat Tran",
        image: "/default-room.png",
    },
    {
        id: "late-night",
        name: "Late Night Loops",
        createdBy: "Kat Tran",
        image: "/default-room.png",
    },
];

export default function YourRoomsPanel() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Your Rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {yourRooms.map((room) => (
                    <div
                        key={room.id}
                        className="flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={room.image}
                                alt={room.name}
                                className="w-12 h-12 rounded bg-muted object-cover"
                            />
                            <div className="text-sm">
                                <p className="font-medium text-primary">{room.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Room • {room.createdBy}
                                </p>
                            </div>
                        </div>
                        <JoinButton roomId={room.id} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
