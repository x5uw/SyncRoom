/**
 * Link Spotify Button Component
 * * This component renders a button that, when clicked, redirects the user to the Spotify login page.
 * * It uses the Supabase authentication system to handle the login process.
 * usesd app/api/spotify/login/route.js
 * 
 * Author: Manuel Rodriguez
 */

"use client"; // This is a client-side component. This is necessary for Next.js to treat this file as a client component.

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LinkSpotifyButton() { //FIXME: Might need to add isSignedIn prop to check if user is already signed in
    const router = useRouter();

    const handleClick = async () => {
        router.push('/api/spotify/login'); // Redirect to the Spotify login route
    };
    
    return (
        <Button onClick={handleClick}>
            Link Spotify Account
        </Button>
    )
}
    
