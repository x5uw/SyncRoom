/*
 * Author: Hyobin Yook
 * 
 * LikeButton.tsx renders a toggleable "Like" (Thumbsup) button, which is triggered by user's click. 
 * It maintains its own internal boolean state to switch between an outline icon and a filled icon. 
*/
"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProp {
    initialLiked?: boolean                      // initial default: NOT liked
    onToggle?: (newValue: boolean) => void;     // first toggle -> liked, next toggle -> un-liked
}


export default function LikeButton({
    initialLiked = false,       // default to be 'NOT liked'
    onToggle
}: LikeButtonProp) {
    const [liked, setLiked] = useState(initialLiked);

    function handleClick() {
        setLiked((prev) => {
            const next = !prev; // next state is the opposite of the prev state
            onToggle?.(next);
            return next;        // return the new state -> 'favorite' = newState
        });
    }

    return (
        <button
            onClick={handleClick}
            aria-label={liked ? "Unlike" : "Like"}          // accessibility feature
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
            <ThumbsUp
                className="h-6 w-6"
                // If liked, fill and remove the stroke
                stroke={liked ? "none" : "currentColor"}
                fill={liked ? "currentColor" : "none"}
            />
        </button>
    );
}