"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface JoinButtonProps {
    roomId: string;
}

export default function JoinButton({ roomId }: JoinButtonProps) {
    const router = useRouter();
    return (
        <Button onClick={() => router.push(`/room/${roomId}`)}>
            Join
        </Button>
    );
}