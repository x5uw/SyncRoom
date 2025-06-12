/**
 * Hyobin Yook
 */

"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import CreateRoomPanel from "./CreateRoomPanel";
import JoinByCodePanel from "./JoinByCodePanel";
import YourRoomsPanel from "./YourRoomsPanel";
import JoinButton from "./ui/JoinButton";

export default function RightSidebar() {

  return (
    <div className="sticky top-20 space-y-6">
      {/* 1) Create Room panel */}
      <CreateRoomPanel />

      {/* 2) Join-by-Code panel */}
      <JoinByCodePanel />

      {/* 3) Your Rooms */}
      <YourRoomsPanel />
    </div>
  );
}
