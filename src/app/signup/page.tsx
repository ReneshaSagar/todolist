"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { user, signInWithGoogle, loading } = useAuth();
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
          <UserPlus className="w-8 h-8 text-black" />
        </div>
        
        <h1 className="text-3xl font-black mb-2 tracking-tighter">Join the Flow.</h1>
        <p className="text-subdued mb-10 font-medium">Create your account to start your grind.</p>
        
        <button 
          onClick={signInWithGoogle}
          className="w-full py-4 bg-white text-black font-bold rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Sign Up with Google
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-subdued uppercase tracking-widest font-bold font-mono">
            Direct Entry Enabled (Demo Mode)
          </p>
        </div>
      </motion.div>
    </main>
  );
}
