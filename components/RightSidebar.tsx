"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

// Mock data
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

export default function RightSidebar() {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const handleCreate = () => {
    if (!roomName.trim()) return;

    const newRoom = {
      roomName,
      description,
      access,
      password: access === "private" ? password : null,
    };

    console.log("Creating room:", newRoom);
    // TODO: Hook into Supabase later

    setRoomName("");
    setDescription("");
    setAccess("public");
    setPassword("");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    router.push(`/room/${joinCode}`);
  };

  return (
    <div className="sticky top-20 space-y-6">
      {/* Create Room Panel */}
      <Card>
        <CardHeader className="pt-6">
          <CardTitle className="text-base">Create your room</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            It’s easy, we’ll help you get started.
          </p>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full">Create Room</Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-lg sm:text-xl">
                  New SyncRoom
                </SheetTitle>
              </SheetHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
                className="mt-6 space-y-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="access">Private Access</Label>
                    <Switch
                      id="access"
                      checked={access === "private"}
                      onCheckedChange={(checked) =>
                        setAccess(checked ? "private" : "public")
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable to restrict room with a password.
                  </p>
                </div>

                {access === "private" && (
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                  <SheetTrigger asChild>
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </SheetTrigger>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* Join a Room Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Join a room</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Already have a room code? Paste it below.
          </p>
          <form onSubmit={handleJoin} className="space-y-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter Room ID"
            />
            <Button type="submit" className="w-full">
              Join Room
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Your Rooms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {yourRooms.map((room) => (
            <a
              key={room.id}
              href={`/room/${room.id}`}
              className="flex items-center gap-4 group"
            >
              <img
                src={room.image}
                alt={room.name}
                className="w-12 h-12 rounded bg-muted object-cover"
              />
              <div className="text-sm">
                <p className="font-medium text-primary group-hover:underline">
                  {room.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Room • {room.createdBy}
                </p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
