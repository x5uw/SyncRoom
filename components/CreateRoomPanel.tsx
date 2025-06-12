/**
 * Hyobin Yook
 *
 * CreateRoomPanel.tsx renders a “Create Room” button that opens a slide over form.
 * On submit, it calls the createRoom service, and redirects user to the new room page
 * on successful room creation. 
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createRoom } from "@/lib/services/roomService";

export default function CreateRoomPanel() {
    const router = useRouter();
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // room create handler
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setIsLoading(true);

        try {
            const newRoomId = await createRoom({
                name: roomName.trim(),
                description: description.trim(),
                is_public: !isPrivate,
                password: isPrivate ? password : "",
            });

            // navigate to the new room
            router.push(`/room/${newRoomId}`);
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to create room. Try again.");
            setIsLoading(false);
        }
    };

    return (
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
                                        checked={isPrivate}
                                        onCheckedChange={setIsPrivate}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enable to restrict room with a password.
                                </p>
                            </div>

                            {isPrivate && (
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
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating…" : "Create"}
                                </Button>
                                <SheetTrigger asChild>
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </SheetTrigger>
                            </div>
                            {errorMsg && (
                                <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
                            )}
                        </form>
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
}
