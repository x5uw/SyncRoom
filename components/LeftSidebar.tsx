/**
 * /components/LeftSidebar.tsx
 */

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import LoginLogoutButton from "./LoginLogout"; // optional reusable client button

async function Sidebar() {

  
  //FIXME: Try a fix to stop hanging on server-side rendering
  //const supabase = supabaseServer();
  const supabase = await supabaseServer();
  
  
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <UnAuthenticatedSidebar />;

  const usernameFallback = user.email?.split("@")[0];
  const displayName =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    usernameFallback;

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${usernameFallback}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage
                  src={user.user_metadata?.avatar_url || "/avatar.png"}
                />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  {usernameFallback}
                </p>
              </div>
            </Link>

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
            {/*TODO: If here is time*/}
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                No location
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                No website
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Welcome Back!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>

        <div className="flex justify-center">
          <LoginLogoutButton isSignedIn={false} />
        </div>
      </CardContent>
    </Card>
  </div>
);
