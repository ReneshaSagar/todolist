"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail, loginAsGuest, loading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  if (loading) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-background to-background" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 glass-dark rounded-[32px] text-center relative z-10 border border-white/5 shadow-2xl"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-secondary rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-brand/20">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-black mb-2 tracking-tighter text-white">Welcome Back.</h1>
        <p className="text-subdued mb-8 font-medium">Log in to resume your OS session.</p>
        
        {errorMsg && <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-xl mb-4">{errorMsg}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-3 mb-6">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-brand transition-colors text-sm"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-brand transition-colors text-sm"
            required
          />
          <button type="submit" className="w-full py-4 bg-white text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg text-sm">
            Sign In Securely
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 opacity-30">
          <div className="h-px bg-white flex-1" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">OR</span>
          <div className="h-px bg-white flex-1" />
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={loginWithGoogle}
            className="w-full py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <button 
            onClick={loginAsGuest}
            className="w-full py-3 bg-brand/10 border border-brand/20 text-brand font-bold rounded-xl hover:bg-brand/20 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <Zap className="w-4 h-4 fill-brand" />
            Bypass (Guest Mode)
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-subdued font-medium">
            Don't have an account? <Link href="/signup" className="text-brand hover:text-white transition-colors">Sign up.</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
