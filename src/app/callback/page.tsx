"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotifyCallback() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      
      if (accessToken) {
        console.log("Spotify Callback: Access token captured.");
        localStorage.setItem("spotify_token", accessToken);
        // Dispatch custom event so context can pick it up immediately
        window.dispatchEvent(new Event("storage"));
        router.push("/dashboard");
      } else {
        console.error("Spotify Callback: No access token found in hash.");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-bold">Syncing Spotify OS...</p>
      </div>
    </div>
  );
}
