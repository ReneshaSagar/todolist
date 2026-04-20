"use client";

import React from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

export const AuthContext = React.createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </SessionProvider>
  );
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const login = async (credentials: any) => {
    return await signIn("credentials", { ...credentials, redirect: false });
  };

  const loginAsGuest = async () => {
    return await signIn("credentials", { isGuest: "true", redirect: false });
  };

  return (
    <AuthContext.Provider value={{ 
      user: session?.user, 
      loading: status === "loading", 
      logout,
      login,
      loginAsGuest,
      isDemoMode: session?.user?.email === "guest@flowstate.ai"
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
