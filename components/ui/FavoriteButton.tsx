/*
 * Author: Hyobin Yook
 * 
 * FavoriteButton.tsx renders a toggleable “Favorite” (heart) button, which is triggered by user's click. 
 * It maintains its own internal boolean state (favorited or not) to switch between an outline heart and a filled heart.
*/

"use client";

import { useState } from "react";
import { HeartIcon, Heart as HeartIconSolid } from "lucide-react";


interface FavButtonProps {
    initialFavorited?: boolean                  // initial default: NOT favorited
    onToggle?: (newValue: boolean) => void;     // first toggle -> fav, next toggle -> un-fav-ed
}

export default function FavoriteButton({
    initialFavorited = false,  // default to be 'NOT favorited'
    onToggle
}: FavButtonProps) {
    const [favorited, setFavorited] = useState(initialFavorited);

    function handleClick() {
        setFavorited((prev) => {
            const next = !prev; // next state is the opposite of the prev state
            onToggle?.(next);
            return next;        // return the new state -> 'favorite' = newState
        });
    }

    return (
        <button
            onClick={handleClick}
            aria-label={favorited ? "Unfavorite" : "Favorite"}   // accessibility feature
            className="p-2 rounded-full hover:bg-grey-100 active:scale-95 transition">
            {favorited ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
                <HeartIcon className="h-6 w-6 text-grey-500" />
            )}
        </button>
    );
}