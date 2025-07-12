"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAlchemyWallet } from "../hooks/useAlchemyWallet";

interface UserContextType {
  user: any;
  walletAddress: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const { walletAddress, loading: walletLoading } = useAlchemyWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when user state is determined
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    walletAddress,
    loading: loading || walletLoading,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
 