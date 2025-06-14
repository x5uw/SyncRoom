/**
 * /components/LoginLogout.tsx
 */

"use client";

import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LoginLogoutButton({ isSignedIn }: { isSignedIn: boolean }) {
  const router = useRouter();

  const handleClick = async () => {
        router.push('/api/spotify/login'); // Redirect to the Spotify login route
    };

  const handleLogout = async () => {
    await supabaseBrowser().auth.signOut();
    router.refresh();
  };

  return isSignedIn ? (
    <Button variant="outline" onClick={handleLogout}>
      Sign Out
    </Button>
  ) : (
     <Button onClick={handleClick}>
        Link Spotify Account
      </Button>
  );
}
/*
  const router = useRouter();

  const handleLogin = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return isSignedIn ? (
    <Button variant="outline" onClick={handleLogout}>
      Sign Out
    </Button>
  ) : (
    <Button variant="default" onClick={handleLogin}>
      Sign In
    </Button>
  );
}
  */
