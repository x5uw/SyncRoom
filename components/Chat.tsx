"use client";

import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import ChatCard, { Message } from "./ChatCard";

interface ChatProps {
    roomId: string;           // must be the real UUID
    currentUserId: string;    // your user's UUID
    currentUsername: string;
}

export default function Chat({
    roomId,
    currentUserId,
    currentUsername,
}: ChatProps) {
    const supabase = supabaseBrowser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // load history & subscribe
    useEffect(() => {
        // fetch and load past messages
        const loadMessages = async () => {
            const { data, error } = await supabase
                .from("chat_messages")
                .select(`
                    message,
                    created_at,
                    users!chat_messages_user_id_fkey(username)`)
                .eq("room_id", roomId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Failed to load messages:", error);
                return;
            }
            if (data) {
                setMessages(
                    // Map DB rows into Message
                    data.map((row) => ({
                        id: row.created_at,
                        user: row.users.username,
                        content: row.message,
                        timestamp: new Date(row.created_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                        ),
                    }))
                );
                // Scroll to bottom after loading 
                scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
            }
        };

        loadMessages();

        // subscribe to new inserts (real time messages)
        const channel = supabase
            .channel(`room-chat-${roomId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `room_id=eq.${roomId}`,
                },
                ({ new: m }) => {
                    const msg: Message = {
                        id: m.created_at,
                        user: currentUsername,
                        content: m.message,
                        timestamp: new Date(m.created_at).toLocaleTimeString(
                            [], { hour: "2-digit", minute: "2-digit" }
                        ),
                    };
                    // add new message and scroll (always show the most current)
                    setMessages((prev) => [...prev, msg]);
                    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, roomId, currentUsername]);

    // send handler
    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = newMessage.trim();
        if (!text) return;
        setNewMessage("");  // after insert, clear the input immediately for the next message

        // UI update
        const now = new Date();
        const optimistic: Message = {
            id: now.toISOString(),
            user: currentUsername,
            content: text,
            timestamp: now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        setMessages((prev) => [...prev, optimistic]);
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);

        // actual insert
        const { data, error } = await supabase
            .from("chat_messages")
            .insert({
                room_id: roomId,
                user_id: currentUserId,
                message: text,
            })
            .select(); // returns the inserted row

        console.log("insert result:", { data, error });
        if (error) {
            // pop up alert so you can debug right away
            window.alert("Chat insert error: " + error.message);
        }
    };

    return (// render UI via chatcard
        <ChatCard
            messages={messages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSend={handleSend}
            scrollContainerRef={scrollRef}
        />
    );
}
