/** Hyobin Yook */
"use client";

import { ArrowUp } from "lucide-react";
import { RefObject } from "react";

export interface Message {
    id: string;
    user: string;
    content: string;
    timestamp: string;
}

interface ChatCardProps {
    messages: Message[];
    newMessage: string;
    onNewMessageChange: (val: string) => void;
    onSend: (e?: React.FormEvent) => void;
    scrollContainerRef: RefObject<HTMLDivElement>;
}

export default function ChatCard({
    messages,
    newMessage,
    onNewMessageChange,
    onSend,
    scrollContainerRef,
}: ChatCardProps) {
    return (
        <div className="bg-light rounded-lg shadow-lg w-full h-[44rem] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-semibold">Live Chat</h3>
            </div>

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-3"
            >
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <p className="text-sm text-gray-300">
                            <span className="font-medium text-gray-500">{msg.user}:</span>{" "}
                            {msg.content}
                        </p>
                        <p className="text-xs text-gray-400 text-right">
                            {msg.timestamp}
                        </p>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form
                onSubmit={onSend}
                className="border-t border-gray-200 py-3 px-4 flex items-center space-x-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 rounded-md border border-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-8 w-8 rounded-full flex items-center justify-center bg-primary hover:bg-primary-dark active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowUp className="h-4 w-4 text-white" />
                </button>
            </form>
        </div>
    );
}
