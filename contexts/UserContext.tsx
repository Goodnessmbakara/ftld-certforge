"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";

interface UserContextType {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const signOut = async () => {
    // This will be handled by the AuthProvider
    if (typeof window !== "undefined") {
      const event = new CustomEvent("sign-out");
      window.dispatchEvent(event);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
 