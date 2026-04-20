"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SpotifyContextType {
  isConnected: boolean;
  accessToken: string | null;
  connect: () => void;
  player: any | null;
  currentTrack: any | null;
  playbackState: any | null;
}

const SpotifyContext = createContext<SpotifyContextType>({} as SpotifyContextType);

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/callback` : "";
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read"
].join("%20");

export const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [playbackState, setPlaybackState] = useState<any>(null);

  const connect = () => {
    if (!SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === "undefined") {
      alert("Spotify Client ID is missing. Please add NEXT_PUBLIC_SPOTIFY_CLIENT_ID to your .env.local file.");
      return;
    }
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    // Check for access token in URL (simple Implicit Grant for demo, should be PKCE in prod)
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        setAccessToken(token);
        window.location.hash = "";
        localStorage.setItem("spotify_token", token);
      }
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      if (savedToken) setAccessToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spPlayer = new window.Spotify.Player({
        name: "FlowState PWA Player",
        getOAuthToken: (cb: any) => { cb(accessToken); },
        volume: 0.5
      });

      spPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Spotify Ready with Device ID", device_id);
      });

      spPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setPlaybackState(state);
        setCurrentTrack(state.track_window.current_track);
      });

      spPlayer.connect();
      setPlayer(spPlayer);
    };

    return () => {
      if (player) player.disconnect();
    };
  }, [accessToken]);

  return (
    <SpotifyContext.Provider value={{ 
      isConnected: !!accessToken, 
      accessToken, 
      connect, 
      player, 
      currentTrack, 
      playbackState 
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}
