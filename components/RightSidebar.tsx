/**
 * Hyobin Yook
 */

"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import CreateRoomPanel from "./CreateRoomPanel";
import JoinByCodePanel from "./JoinByCodePanel";
import JoinButton from "./ui/JoinButton";

export default function RightSidebar() {
  // Static list of “Your Rooms”
  const yourRooms = [
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

  return (
    <div className="sticky top-20 space-y-6">
      {/* 1) Create Room panel */}
      <CreateRoomPanel />

      {/* 2) Join-by-Code panel */}
      <JoinByCodePanel />

      {/* 3) Your Rooms */}
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
              {/* gate join with password if needed */}
              <JoinButton roomId={room.id} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
