"use client";

import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const { user, loginWithGoogle, signupWithEmail, loading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMode, setSuccessMode] = useState(false);

  if (loading) return null;

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupWithEmail(email, password);
      setSuccessMode(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
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
        <AnimatePresence mode="wait">
          {!successMode ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-secondary rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-brand/20">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-3xl font-black mb-2 tracking-tighter text-white">Join the Flow.</h1>
              <p className="text-subdued mb-8 font-medium">Create your OS account.</p>
              
              {errorMsg && <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-xl mb-4">{errorMsg}</p>}

              <form onSubmit={handleEmailSignup} className="space-y-3 mb-6">
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
                  placeholder="Password (min 6 characters)" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-brand transition-colors text-sm"
                  minLength={6}
                  required
                />
                <button type="submit" className="w-full py-4 bg-brand text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] text-sm">
                  Create Account
                </button>
              </form>

              <div className="flex items-center gap-4 my-6 opacity-30">
                <div className="h-px bg-white flex-1" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">OR</span>
                <div className="h-px bg-white flex-1" />
              </div>
              
              <button 
                onClick={loginWithGoogle}
                className="w-full py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold rounded-xl flex items-center justify-center gap-3 transition-colors text-sm mb-4"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Sign up with Google
              </button>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-xs text-subdued font-medium">
                  Already have an account? <Link href="/login" className="text-brand hover:text-white transition-colors">Log in.</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-20 h-20 bg-green-500/10 rounded-full mx-auto mb-6 flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <MailCheck className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black mb-4 text-white">Verify Your Email</h2>
              <p className="text-subdued leading-relaxed mb-8">
                We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.
              </p>
              <Link href="/login" className="block w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors text-sm">
                Return to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
