"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loginAsGuest, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 glass-dark rounded-[32px] text-center"
      >
        <div className="w-16 h-16 bg-brand rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-brand/20">
          <LogIn className="w-8 h-8 text-black" />
        </div>
        
        <h1 className="text-3xl font-black mb-2 tracking-tighter text-white">Welcome Back.</h1>
        <p className="text-subdued mb-10 font-medium">Log in to resume your flow state.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => loginAsGuest()}
            className="w-full py-4 bg-brand text-black font-black rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand/20 group relative overflow-hidden"
          >
            <Zap className="w-5 h-5 fill-black" />
            Continue as Guest
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button 
            disabled
            className="w-full py-4 bg-white/5 border border-white/10 text-subdued font-bold rounded-full flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale" alt="Google" />
            Google Login (Soon)
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-subdued uppercase tracking-widest font-bold font-mono">
            Direct Entry Enabled (Demo Mode)
          </p>
        </div>
      </motion.div>
    </main>
  );
}
