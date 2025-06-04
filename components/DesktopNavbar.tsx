/**
 * /components/DesktopNavbar.tsx
 */

import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { supabaseServer } from "@/lib/supabase/server";
import LoginLogoutButton from "./LoginLogout";

export default async function DesktopNavbar() {


  //FIXME: Try a fix to stop hanging on server-side rendering
  //const supabase = supabaseServer();
  const supabase = await supabaseServer();



  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user && (
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href={`/profile/${user.user_metadata?.username ?? "guest"}`}>
            <UserIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </Button>
      )}

      <LoginLogoutButton isSignedIn={!!user} />
    </div>
  );
}
