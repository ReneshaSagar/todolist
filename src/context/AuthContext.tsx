"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (!res.user.emailVerified) {
      throw new Error("Please verify your email via the link sent to your inbox before logging in.");
    }
    router.push("/dashboard");
  };

  const signupWithEmail = async (email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(res.user);
    // User is created but needs to verify email.
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const loginAsGuest = async () => {
    // Basic guest fallback via a hardcoded generic sign in if desired, 
    // but we'll disable this locally if Firebase is main.
    // For now, let's keep the user out unless they login with Google or Email.
    router.push("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      loginAsGuest,
      isDemoMode: false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
