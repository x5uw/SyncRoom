
/**
 * /components/RightSidebar.tsx
 */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createRoom, getRoomIdByJoinId } from "@/lib/services/roomService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// mock data
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
  const router = useRouter();

  // Starting state variable for room creation form
  const [roomName, setRoomName] = useState("");               // Room name input
  const [description, setDescription] = useState("");         // Room description input
  const [access, setAccess] = useState<false | true>(false);  // Access switch (false = public, true = private)
  const [password, setPassword] = useState("");               // Password input (only used if access is private)


  // Join‐by‐code state
  const [joinCode, setJoinCode] = useState("");               // Join code input
  const [isJoining, setIsJoining] = useState(false);          // Joining state
  const [joinError, setJoinError] = useState<string | null>(null); 

  // UI state for loading / error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // Handle 'Creat Room' form submission
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const newRoomId = await createRoom({
        name: roomName.trim(),
        description: description.trim(),
        is_public: access,  // default: false (public)
        password: access === true ? password : "",
      });

      // Redirect to the newly-created room page
      router.push(`/room/${newRoomId}`);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create room. Try again.");
      setIsLoading(false);
    }
  };


  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    if (!joinCode.trim()) {
      setJoinError("Please enter a code.");
      return;
    }

    setIsJoining(true);

    try {
      // Call the service to get a room_id from the joinCode
      const roomId = await getRoomIdByJoinId(joinCode.trim());
      // If successful, redirect to `/room/[roomId]`
      router.push(`/room/${roomId}`);
    } catch (err: any) {
      // Show error if code was invalid or lookup failed
      setJoinError(err.message || "Could not join room.");
      setIsJoining(false);
    }
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

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
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
                      checked={access === false}
                      onCheckedChange={(checked) =>
                        setAccess(checked ? true : false)
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enable to restrict room with a password.
                  </p>
                </div>

                {access === true && (
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
              disabled={isJoining}
            />
            <Button type="submit" className="w-full" disabled={isJoining}>
              {isJoining ? "Joining…" : "Join Room"}
            </Button>
          </form>
          {joinError && (
            <p className="text-sm text-red-500 mt-2">{joinError}</p>
          )}
        </CardContent>
      </Card>


      {/* Your Rooms (static links) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {yourRooms.map((room) => (
            <a
              key={room.id}
              href={`/room/test-room`} // point this to test-room as well
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



