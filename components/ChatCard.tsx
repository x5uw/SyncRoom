"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface Message {
    id: string;
    user: string;
    content: string;
    timestamp: string;
}

export default function ChatCard() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "msg1", user: "UserA", content: "Hello world!", timestamp: "1:00 PM" },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    function handleSend(e?: React.FormEvent) {
        // If called from a form submit, prevent default page reload
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        const newId = `msg${messages.length + 1}`;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
            ...prev,
            { id: newId, user: "You", content: newMessage.trim(), timestamp: now },
        ]);
        setNewMessage("");
        // After sending, collapse any open timestamp
        setSelectedMessageId(null);
    }

    function toggleTimestamp(id: string) {
        setSelectedMessageId((prev) => (prev === id ? null : id));
    }

    return (
        <div className="bg-light rounded-lg shadow-lg w-full max-w-md h-[44rem] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-semibold">Live Chat</h3>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="cursor-pointer"
                        onClick={() => toggleTimestamp(msg.id)}
                    >
                        {/* Username + message wraps */}
                        <p className="text-sm text-gray-300">
                            <span className="font-medium text-gray-500">{msg.user}:</span>{" "}
                            {msg.content}
                        </p>

                        {/* Timestamp below, right-aligned, visible only if selected */}
                        {selectedMessageId === msg.id && (
                            <p className="text-xs text-gray-400 text-right">
                                {msg.timestamp}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Wrap input+button in a form so Enter key triggers submit */}
            <form onSubmit={handleSend} className="border-t border-gray-200 py-3 flex items-center space-x-2 w-full">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 rounded-md border border-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`
                        h-8 w-8 
                        rounded-full 
                        flex items-center justify-center 
                        bg-primary 
                        hover:bg-primary-dark 
                        active:scale-95 
                        transition 
                        ${!newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <ArrowUp className="h-4 w-4 text-white" />
                </button>
            </form>
        </div>
    );
}
