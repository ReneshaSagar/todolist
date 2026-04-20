"use client";

import React, { useState, useEffect } from "react";
import { useSpotify } from "@/context/SpotifyContext";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, Music2, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FocusMode() {
  const { player, isConnected, currentTrack } = useSpotify();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [session, setSession] = useState<"Work" | "Break">("Work");

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const nextSession = session === "Work" ? "Break" : "Work";
      setSession(nextSession);
      setTimeLeft(nextSession === "Work" ? 25 * 60 : 5 * 60);
      setIsActive(false);
      
      // Attempt to auto-pause Spotify on break
      if (player && nextSession === "Break") player.pause();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, session, player]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && player) {
       // Attempt to resume music on start
       player.resume();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <motion.div 
        animate={{ scale: isActive ? 1.05 : 1 }}
        className="relative w-80 h-80 flex items-center justify-center"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="160" cy="160" r="150" 
            className="stroke-white/5 fill-none" 
            strokeWidth="8" 
          />
          <motion.circle 
            cx="160" cy="160" r="150" 
            className="stroke-brand fill-none" 
            strokeWidth="8" 
            strokeLinecap="round"
            initial={{ strokeDasharray: 942, strokeDashoffset: 942 }}
            animate={{ strokeDashoffset: 942 - (942 * (timeLeft / (session === "Work" ? 25 * 60 : 5 * 60))) }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="text-center">
           <span className="text-xs font-bold text-brand uppercase tracking-[0.2em] mb-2 block">{session} Session</span>
           <h2 className="text-7xl font-black tracking-tighter tabular-nums">{formatTime(timeLeft)}</h2>
        </div>
      </motion.div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={() => {setIsActive(false); setTimeLeft(25 * 60)}}
          className="w-16 h-16 glass text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={28} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <FocusOption 
          icon={<Music2 size={20} />} 
          label="Lofi Beats" 
          onClick={() => {}} 
        />
        <FocusOption 
          icon={<Coffee size={20} />} 
          label="Rain Ambiance" 
          onClick={() => {}} 
        />
      </div>

      {currentTrack && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark p-6 rounded-3xl flex items-center gap-4 fixed bottom-10 left-1/2 -translate-x-1/2 min-w-[300px]"
        >
           <img src={currentTrack.album.images[0].url} className="w-12 h-12 rounded-lg" alt="Album" />
           <div>
              <p className="text-sm font-bold truncate max-w-[150px]">{currentTrack.name}</p>
              <p className="text-[10px] text-brand uppercase tracking-widest font-black">Syncing Focus</p>
           </div>
           <div className="ml-auto">
              <div className="flex gap-1">
                 {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 16, 8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 bg-brand rounded-full"
                    />
                 ))}
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}

function FocusOption({ icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button className="flex items-center gap-4 p-5 glass rounded-2xl hover:bg-white/5 transition-all text-left">
      <div className="text-brand">{icon}</div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
