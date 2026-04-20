"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    console.log("AuthContext: Initializing Firebase Auth Listener...");

    // Fallback timer: Always stop loading after 3 seconds no matter what.
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("AuthContext: Safety timer triggered. Forcing loading state to false.");
        setLoading(false);
      }
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AuthContext: State Changed. User:", currentUser ? "Authenticated" : "Logged Out");
      setUser(currentUser);
      setLoading(false);
      clearTimeout(safetyTimer);
    }, (error) => {
      console.error("AuthContext: Auth State Error:", error);
      setLoading(false);
      clearTimeout(safetyTimer);
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      alert("Failed Google Auth: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (!res.user.emailVerified) {
        setLoading(false);
        throw new Error("Please verify your email via the link sent to your inbox before logging in.");
      }
      router.push("/dashboard");
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      console.log("AuthContext: Attempting Guest Login...");
      setLoading(true);
      await signInAnonymously(auth);
      console.log("AuthContext: Guest Login Success. Redirecting...");
      router.push("/dashboard");
    } catch (error: any) {
       console.error("Guest error:", error);
       alert("Guest Mode failed! Double-check Firebase Anonymous Auth is enabled! Error: " + error.message);
    } finally {
       setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      resetPassword,
      loginAsGuest,
      isDemoMode: user?.isAnonymous || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
