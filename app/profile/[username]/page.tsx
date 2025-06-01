"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import LinkSpotifyButton from "@/components/LinkSpotifyButton";
// import { supabaseBrowser } from '@/lib/supabase/browser'; // Uncomment when ready

/* Once You're Ready to Use Supabase
Uncomment the supabaseBrowser() logic

Replace console.log() in handleUpdate() with a call to:

ts
Copy
Edit
await supabase.from('profiles').update({...}).eq('id', user.id); //*/

export default function ProfileSettingsPage() {
  // Scaffolded state for profile fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  // Scaffolded: Populate with mock or Supabase later
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      // 🔸 When ready:
      // const supabase = supabaseBrowser();
      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   setName(user.user_metadata?.name || '');
      //   setUsername(user.user_metadata?.username || '');
      // }

      // For now, use mock data
      setName("Kat Tran");
      setUsername("katqa");
      setLocation("Issaquah, WA");
      setWebsite("https://kat.dev");

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔸 Hook up with Supabase `updateUser()` or `updateProfile()`
    console.log("Saving profile:", { name, username, location, website });

    setTimeout(() => setLoading(false), 1000); // Simulate delay
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Spotify Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Spotify Information</CardTitle>
          <CardContent>
            <div>
              <label htmlFor="spotify-username" className="block mb-2">
                Username
              </label>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Connect Your Spotify</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Link your Spotify account to sync your favorite tracks and playlists.
        </p>
      </div>
      <LinkSpotifyButton/>
    </div>
  );
}
